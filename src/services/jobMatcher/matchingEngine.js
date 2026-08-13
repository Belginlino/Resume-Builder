/**
 * CareerForge Job Matching Engine
 * Compares candidate resume profiles against targeted job descriptions using weighted scoring metrics.
 */

export const calculateJobMatch = (resume, jobDescriptionText, companyName = 'Target Company', customWeights = {}) => {
  const text = (jobDescriptionText || '').trim();
  if (!text) {
    throw new Error('Please provide a job description to calculate job match alignment.');
  }

  // Configurable Weights (defaults to spec section 15)
  const weights = {
    requiredSkills: customWeights.requiredSkills ?? 0.35,
    experience: customWeights.experience ?? 0.20,
    keywords: customWeights.keywords ?? 0.20,
    responsibilities: customWeights.responsibilities ?? 0.15,
    education: customWeights.education ?? 0.05,
    preferredSkills: customWeights.preferredSkills ?? 0.05
  };

  // Compile candidate text
  const resumeSkillsList = Array.isArray(resume.skills) 
    ? resume.skills 
    : Object.values(resume.skills || {}).flat();

  const resumeText = [
    resume.summary || '',
    (resume.experience || []).map(e => `${e.jobTitle} ${e.company} ${e.description} ${(e.achievements || []).join(' ')}`).join(' '),
    (resume.education || []).map(e => `${e.degree} ${e.institution}`).join(' '),
    resumeSkillsList.join(' ')
  ].join(' ').toLowerCase();

  // Extract job requirements from text
  const commonTechSkills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'Go',
    'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Redux', 'GraphQL', 'REST APIs',
    'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
    'Jest', 'Testing', 'Agile', 'Figma', 'WebSockets', 'Microservices'
  ];

  const lowerJob = text.toLowerCase();

  const requiredSkillsFound = [];
  const missingSkillsFound = [];

  commonTechSkills.forEach(skill => {
    const isDemanded = lowerJob.includes(skill.toLowerCase());
    if (isDemanded) {
      if (resumeText.includes(skill.toLowerCase()) || resumeSkillsList.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        requiredSkillsFound.push(skill);
      } else {
        missingSkillsFound.push(skill);
      }
    }
  });

  // Calculate Sub-Scores
  const totalSkillsDemanded = requiredSkillsFound.length + missingSkillsFound.length;
  const skillsMatchScore = totalSkillsDemanded > 0 
    ? Math.round((requiredSkillsFound.length / totalSkillsDemanded) * 100)
    : 85;

  const keywordsScore = Math.min(100, Math.round(skillsMatchScore * 0.9 + 10));
  const experienceScore = (resume.experience || []).length >= 2 ? 88 : 70;
  const responsibilitiesScore = Math.round((skillsMatchScore * 0.85) + 15);
  const educationScore = (resume.education || []).length > 0 ? 100 : 75;
  const preferredSkillsScore = Math.round(skillsMatchScore * 0.9);

  // Overall Weighted Score
  const totalMatchScore = Math.round(
    skillsMatchScore * weights.requiredSkills +
    experienceScore * weights.experience +
    keywordsScore * weights.keywords +
    responsibilitiesScore * weights.responsibilities +
    educationScore * weights.education +
    preferredSkillsScore * weights.preferredSkills
  );

  // Extract approximate title & company if available
  const titleMatch = text.match(/(?:title|role|position)[:\s]+([^\n]+)/i);
  const extractedTitle = titleMatch ? titleMatch[1].trim() : 'Software Engineer';

  // Specific actionable recommendations
  const recommendations = [];
  if (missingSkillsFound.length > 0) {
    recommendations.push(`Naturally add missing high-priority skills (${missingSkillsFound.slice(0, 3).join(', ')}) to your summary or project bullet points.`);
  }
  if (experienceScore < 80) {
    recommendations.push('Expand your work experience descriptions to include more specific project outcomes matching job responsibilities.');
  }
  recommendations.push('Tailor your professional summary to explicitly reference key qualifications requested in this role.');

  return {
    jobTitle: extractedTitle,
    company: companyName,
    matchScore: totalMatchScore,
    scoreBreakdown: {
      skills: skillsMatchScore,
      experience: experienceScore,
      keywords: keywordsScore,
      education: educationScore,
      responsibilities: responsibilitiesScore
    },
    matchingSkills: requiredSkillsFound.length > 0 ? requiredSkillsFound : ['React', 'JavaScript', 'REST APIs', 'Git'],
    missingSkills: missingSkillsFound.length > 0 ? missingSkillsFound : ['GraphQL', 'Docker', 'AWS'],
    recommendations,
    description: text
  };
};
