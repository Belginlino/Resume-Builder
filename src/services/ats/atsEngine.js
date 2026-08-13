/**
 * CareerForge Explainable ATS Scoring Engine
 * Analyzes resume data and provides multi-dimensional ATS evaluation scores,
 * severity-classified issues, recommended fixes, and keyword distribution.
 */

// Action verbs database for content quality verification
const STRONG_ACTION_VERBS = [
  'architected', 'accelerated', 'engineered', 'spearheaded', 'developed', 
  'implemented', 'delivered', 'optimized', 'reduced', 'increased', 'led', 
  'collaborated', 'designed', 'launched', 'refactored', 'mentored', 
  'automated', 'built', 'transformed', 'improved', 'deployed', 'orchestrated'
];

export const analyzeResumeATS = (resume, targetJobDescription = '') => {
  const criticalIssues = [];
  const improvements = [];
  const strengths = [];

  // Extract raw text or assemble from resume object
  let fullText = resume.rawText || '';
  if (!fullText) {
    const info = resume.personalInfo || {};
    const summary = resume.summary || '';
    const expText = (resume.experience || []).map(e => `${e.jobTitle} ${e.company} ${e.description} ${(e.achievements || []).join(' ')}`).join(' ');
    const eduText = (resume.education || []).map(e => `${e.degree} ${e.institution}`).join(' ');
    const skillsText = Array.isArray(resume.skills) ? resume.skills.join(' ') : Object.values(resume.skills || {}).flat().join(' ');
    fullText = `${info.fullName} ${info.email} ${info.phone} ${summary} ${expText} ${eduText} ${skillsText}`;
  }

  const lowerText = fullText.toLowerCase();

  // 1. ATS Compatibility Check (Standard Headings, Layout risks)
  let atsCompatScore = 90;
  
  if (resume.templateId === 'template_01') {
    atsCompatScore += 8; // Classic template bonus
  }

  // Check contact info completeness
  const info = resume.personalInfo || {};
  if (!info.email || !info.phone) {
    atsCompatScore -= 15;
    criticalIssues.push({
      id: 'crit_contact',
      title: 'Missing Essential Contact Details',
      severity: 'high',
      explanation: 'Email address or phone number could not be clearly identified.',
      whyItMatters: 'Recruiters and automated screeners will reject profiles without direct contact methods.',
      recommendedFix: 'Ensure your email and phone number are clearly placed at the very top of your resume in plain text.'
    });
  } else {
    strengths.push('Contact information (email and phone) is clearly present at the top level.');
  }

  // Check section presence
  const hasExperience = (resume.experience || []).length > 0 || lowerText.includes('experience') || lowerText.includes('employment');
  const hasEducation = (resume.education || []).length > 0 || lowerText.includes('education');
  const hasSkills = (resume.skills && (Array.isArray(resume.skills) ? resume.skills.length > 0 : Object.keys(resume.skills).length > 0)) || lowerText.includes('skills');

  if (!hasExperience) {
    atsCompatScore -= 20;
    criticalIssues.push({
      id: 'crit_exp',
      title: 'Missing Standard Work Experience Section',
      severity: 'high',
      explanation: 'The Work Experience section is missing or uses non-standard heading names.',
      whyItMatters: 'ATS parsers look for terms like "Work Experience", "Professional Experience", or "Employment History".',
      recommendedFix: 'Add a dedicated section titled "Work Experience" with clear job titles and dates.'
    });
  }

  // 2. Content Quality (Action verbs, metrics, conciseness)
  let contentQualityScore = 75;
  let actionVerbCount = 0;
  STRONG_ACTION_VERBS.forEach(verb => {
    if (lowerText.includes(verb)) actionVerbCount++;
  });

  if (actionVerbCount >= 4) {
    contentQualityScore += 15;
    strengths.push(`Strong action-oriented phrasing detected (${actionVerbCount}+ high-impact verbs).`);
  } else {
    improvements.push({
      id: 'imp_verbs',
      title: 'Increase Action-Oriented Phrasing',
      severity: 'medium',
      explanation: 'Your bullet points rely on passive descriptions rather than strong action verbs.',
      whyItMatters: 'Resumes starting bullets with verbs like "Spearheaded", "Engineered", or "Delivered" score significantly higher with hiring managers.',
      recommendedFix: 'Begin every experience bullet point with an impactful past-tense action verb.'
    });
  }

  // Check quantifiable achievements (numbers, %, $)
  const numbersMatch = fullText.match(/\d+%/g) || fullText.match(/\$\d+/g) || fullText.match(/\d+x/gi);
  if (numbersMatch && numbersMatch.length >= 3) {
    contentQualityScore += 10;
    strengths.push(`Quantifiable impact metrics found (${numbersMatch.length} measurable indicators present).`);
  } else {
    improvements.push({
      id: 'imp_metrics',
      title: 'Add Quantifiable Measurable Results',
      severity: 'medium',
      explanation: 'Few quantifiable metrics (percentages, dollar amounts, time saved) were detected in your accomplishments.',
      whyItMatters: 'Concrete metrics demonstrate actual business impact rather than listing routine duties.',
      recommendedFix: 'Quantify your impact (e.g., "Reduced load times by 40%", "Increased active users by 15k").'
    });
  }

  // 3. Keyword Match & Skills Coverage
  let keywordScore = 80;
  let skillsScore = 82;
  const keywordDistribution = [];

  const defaultJobKeywords = [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'REST APIs', 'Git', 
    'Testing', 'Performance', 'Agile', 'Docker', 'AWS', 'Node.js', 'CI/CD'
  ];

  let targetKeywords = defaultJobKeywords;

  if (targetJobDescription) {
    const words = targetJobDescription.split(/\W+/).filter(w => w.length > 3);
    const uniqueJobWords = [...new Set(words)];
    targetKeywords = uniqueJobWords.slice(0, 15);
  }

  let foundCount = 0;
  targetKeywords.forEach(kw => {
    const isFound = lowerText.includes(kw.toLowerCase());
    if (isFound) foundCount++;
    keywordDistribution.push({
      keyword: kw,
      status: isFound ? 'found' : 'missing',
      count: isFound ? (fullText.match(new RegExp(kw, 'gi')) || []).length : 0
    });
  });

  const matchRatio = targetKeywords.length > 0 ? foundCount / targetKeywords.length : 0.8;
  keywordScore = Math.round(matchRatio * 100);
  skillsScore = Math.min(100, Math.round(matchRatio * 90 + 10));

  if (matchRatio < 0.6) {
    improvements.push({
      id: 'imp_keywords',
      title: 'Target Keyword Coverage Gap',
      severity: 'high',
      explanation: `Missing several target industry keywords (${targetKeywords.length - foundCount} missing out of ${targetKeywords.length}).`,
      whyItMatters: 'ATS filters reject candidates who do not meet minimum threshold keyword densities.',
      recommendedFix: 'Naturally integrate missing technical skills and tools into your summary and project bullets.'
    });
  }

  // 4. Formatting
  let formattingScore = 92;

  // Final Overall Score (Weighted Average)
  const overallScore = Math.min(100, Math.max(10, Math.round(
    atsCompatScore * 0.30 +
    contentQualityScore * 0.25 +
    keywordScore * 0.20 +
    skillsScore * 0.15 +
    formattingScore * 0.10
  )));

  let compatibilityLabel = 'Excellent ATS Compatibility';
  if (overallScore < 60) compatibilityLabel = 'Needs Immediate Improvement';
  else if (overallScore < 75) compatibilityLabel = 'Moderate ATS Compatibility';
  else if (overallScore < 85) compatibilityLabel = 'Strong ATS Compatibility';

  return {
    atsScore: overallScore,
    compatibilityLabel,
    scores: {
      atsCompatibility: Math.min(100, atsCompatScore),
      keywordMatch: Math.min(100, keywordScore),
      contentQuality: Math.min(100, contentQualityScore),
      skillsCoverage: Math.min(100, skillsScore),
      formatting: Math.min(100, formattingScore)
    },
    criticalIssues,
    improvements,
    strengths,
    keywordDistribution
  };
};
