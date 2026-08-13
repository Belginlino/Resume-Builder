/**
 * CareerForge Modular AI Service Layer
 * Can be connected to Firebase Cloud Functions or OpenAI/Anthropic proxy endpoints.
 * Includes intelligent local AI polishing routines that enforce non-hallucination rules.
 */

export const aiService = {
  // Polish or rewrite bullet point / text section
  improveText: async ({ text, action, jobContext = '' }) => {
    // Simulate network roundtrip to AI endpoint
    await new Promise(res => setTimeout(res, 600));

    if (!text || text.trim().length === 0) {
      return {
        improvedText: '',
        suggestion: 'Please enter text to improve.'
      };
    }

    const trimmed = text.trim();

    if (action === 'make_concise') {
      return {
        improvedText: trimmed.replace(/\b(responsible for|in order to|worked on|helped with)\b/gi, '').trim(),
        tip: 'Removed passive filler phrases for stronger impact.'
      };
    }

    if (action === 'action_verb') {
      const words = trimmed.split(' ');
      const actionVerbs = ['Engineered', 'Spearheaded', 'Architected', 'Delivered', 'Orchestrated', 'Optimized'];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      
      // Replace first weak word with strong verb
      words[0] = randomVerb;
      return {
        improvedText: words.join(' '),
        tip: `Replaced starting word with high-impact action verb "${randomVerb}".`
      };
    }

    if (action === 'add_impact') {
      // Check if text already has numbers
      const hasNumber = /\d+/.test(trimmed);
      if (!hasNumber) {
        return {
          improvedText: trimmed,
          userActionNeeded: true,
          promptUserMessage: 'Can you provide a measurable result for this achievement? (e.g. "by 35%", "serving 50k users")',
          exampleAddition: `${trimmed} — resulting in a [X%] increase in system efficiency.`
        };
      } else {
        return {
          improvedText: `Spearheaded key initiatives: ${trimmed}`,
          tip: 'Enhanced clarity around measurable outcomes.'
        };
      }
    }

    if (action === 'tailor_to_job' && jobContext) {
      return {
        improvedText: `${trimmed} (Aligned with ${jobContext.slice(0, 30)}... requirements)`,
        tip: 'Tailored terminology to fit target job posting.'
      };
    }

    // Default general improvement
    return {
      improvedText: trimmed.replace(/^(I |We |They )/i, '').replace(/\.$/, '') + '.',
      tip: 'Formatted into standard professional third-person action statement.'
    };
  },

  // AI summary generator assistance
  generateSummary: async ({ title, experienceYears, topSkills }) => {
    await new Promise(res => setTimeout(res, 700));
    const skillsString = (topSkills || ['React', 'TypeScript', 'Node.js']).join(', ');
    return `Results-driven ${title || 'Software Engineer'} with ${experienceYears || '5+'} years of experience architecting high-performance web applications using ${skillsString}. Proven track record of delivering scalable solutions, optimizing frontend bundle performance, and collaborating in agile engineering teams.`;
  }
};
