export const parseRawResumeText = (rawText) => {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Contact Info extraction via regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const githubRegex = /(github\.com\/[a-zA-Z0-9_-]+)/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  // Attempt to extract name from top 3 lines
  let extractedName = 'Candidate Name';
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (!firstLine.includes('@') && !firstLine.match(/\d/) && firstLine.length < 50) {
      extractedName = firstLine;
    }
  }

  // Keywords lists for skill detection
  const techSkillKeywords = [
    'javascript', 'typescript', 'react', 'next.js', 'vue', 'angular', 'node.js', 'express',
    'python', 'django', 'flask', 'java', 'spring', 'c++', 'c#', '.net', 'sql', 'postgresql',
    'mongodb', 'redis', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'tailwind css',
    'rest api', 'graphql', 'ci/cd', 'html', 'css', 'jest', 'cypress', 'figma'
  ];

  const foundSkills = new Set();
  const lowerText = text.toLowerCase();
  techSkillKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      // capitalize nicely
      foundSkills.add(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  // Basic section splitting by common headers
  const sections = {
    summary: '',
    experience: [],
    education: [],
    skills: Array.from(foundSkills),
    rawText: text
  };

  const summaryMatch = text.match(/(?:summary|profile|about me|objective)[:\n\s]+([\s\S]*?)(?=(?:experience|employment|work history|education|skills|projects|$))/i);
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim().slice(0, 500);
  }

  return {
    personalInfo: {
      fullName: extractedName,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      github: githubMatch ? githubMatch[0] : '',
      location: 'San Francisco, CA'
    },
    summary: sections.summary || lines.slice(1, 4).join(' '),
    skills: sections.skills,
    rawText: text
  };
};
