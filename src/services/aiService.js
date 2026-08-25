/**
 * CareerForge Modular AI Service Layer
 * Generates ATS-optimized achievement bullets, professional summaries, 
 * and impact rewrites with measurable metrics and active verbs.
 */

const STRONG_VERBS = [
  'Architected', 'Spearheaded', 'Engineered', 'Optimized', 
  'Delivered', 'Orchestrated', 'Refactored', 'Accelerated', 
  'Implemented', 'Automated', 'Streamlined', 'Pioneered', 'Scaled'
];

const METRICS_POOL = [
  'improving performance and user engagement by 35%',
  'reducing initial page load times and bundle latency by 40%',
  'increasing automated test coverage from 45% to 92%',
  'cutting infrastructure cloud execution costs by 28%',
  'accelerating CI/CD deployment pipeline cycles by 45%',
  'reducing bundle size by 38KB and achieving 100% WCAG accessibility compliance',
  'serving over 100k+ daily requests with sub-50ms render latency',
  'decreasing production bug reports by 30% through structured code reviews',
  'accelerating cross-functional team delivery velocity by 25%'
];

// Role-specific bullet templates for instant intelligent generation
const ROLE_BULLET_PATTERNS = {
  frontend: [
    (title, company) => `Engineered responsive, accessible user interfaces using React, TypeScript, and modern component architecture, improving user engagement by 35%${company ? ` at ${company}` : ''}.`,
    (title, company) => `Spearheaded design system refactoring and bundle optimization, cutting initial load times by 40% and elevating Core Web Vitals to 95+ score.`,
    (title, company) => `Architected micro-frontend modules and client-side caching strategies, reducing network payload size by 45% and eliminating layout shifts.`,
    (title, company) => `Collaborated closely with UX designers and product managers in agile sprints to deliver 15+ production features with 100% WCAG accessibility compliance.`
  ],
  backend: [
    (title, company) => `Architected and deployed scalable RESTful and GraphQL microservices, handling over 50k requests/sec with sub-40ms latency${company ? ` at ${company}` : ''}.`,
    (title, company) => `Optimized database indexing and asynchronous caching pipelines with Redis/PostgreSQL, cutting query response times by 55%.`,
    (title, company) => `Engineered robust authentication, rate limiting, and RBAC authorization workflows, safeguarding sensitive user data and meeting strict security standards.`,
    (title, company) => `Automated CI/CD container deployment pipelines using Docker and Kubernetes, reducing production release rollback rate to under 0.5%.`
  ],
  fullstack: [
    (title, company) => `Engineered end-to-end full stack web platforms utilizing React, Node.js, and cloud backends, accelerating user workflow completion by 45%${company ? ` at ${company}` : ''}.`,
    (title, company) => `Spearheaded API architectural redesign, reducing server response times by 38% while expanding cross-service telemetry monitoring.`,
    (title, company) => `Implemented automated testing pipelines (Jest, Playwright, CI/CD), elevating test coverage from 50% to 92% across all core platform services.`,
    (title, company) => `Mentored junior engineers through technical design reviews and pair programming, elevating overall team delivery velocity by 25%.`
  ],
  devops: [
    (title, company) => `Orchestrated scalable cloud infrastructure using Terraform, Kubernetes, and AWS, achieving 99.99% service availability${company ? ` at ${company}` : ''}.`,
    (title, company) => `Automated zero-downtime deployment pipelines with GitHub Actions, reducing build and release cycle times by 60%.`,
    (title, company) => `Configured Prometheus and Grafana real-time monitoring and alerting, reducing mean time to detection (MTTD) by 45%.`
  ],
  general: [
    (title, company) => `Spearheaded development of high-impact features as ${title || 'Software Engineer'}${company ? ` at ${company}` : ''}, accelerating delivery velocity by 30%.`,
    (title, company) => `Engineered scalable architectures and optimized key system bottlenecks, reducing processing latency by 40%.`,
    (title, company) => `Collaborated across cross-functional engineering, design, and product teams to deliver high-quality production releases on schedule.`,
    (title, company) => `Automated testing and continuous delivery workflows, improving code quality and decreasing production defect rates by 35%.`
  ]
};

const getRoleCategory = (jobTitle = '') => {
  const lower = (jobTitle || '').toLowerCase();
  if (lower.includes('front') || lower.includes('react') || lower.includes('ui') || lower.includes('web')) return 'frontend';
  if (lower.includes('back') || lower.includes('api') || lower.includes('data') || lower.includes('node') || lower.includes('python') || lower.includes('java')) return 'backend';
  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || lower.includes('sre')) return 'devops';
  if (lower.includes('full') || lower.includes('software') || lower.includes('engineer') || lower.includes('developer')) return 'fullstack';
  return 'general';
};

export const aiService = {
  // Polish or generate bullet point / text section
  improveText: async ({ text = '', action = 'add_impact', jobContext = '', jobTitle = '', company = '', skills = [] }) => {
    // Simulate natural AI thinking time (300ms)
    await new Promise(res => setTimeout(res, 300));

    const trimmed = (text || '').trim();

    // 1. If text is EMPTY: Auto-generate an impactful bullet point tailored to the role
    if (!trimmed || trimmed.length === 0) {
      const category = getRoleCategory(jobTitle || jobContext);
      const patterns = ROLE_BULLET_PATTERNS[category] || ROLE_BULLET_PATTERNS.general;
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      const generated = randomPattern(jobTitle, company);

      return {
        improvedText: generated,
        tip: `Generated ATS achievement bullet for ${jobTitle || 'your role'}.`
      };
    }

    // 2. Action: Make Concise
    if (action === 'make_concise') {
      let concise = trimmed
        .replace(/\b(responsible for|in order to|worked on|helped with|tasked with|assisted in|was involved in)\b/gi, '')
        .replace(/^(I |We |They )/i, '')
        .trim();
      
      concise = concise.charAt(0).toUpperCase() + concise.slice(1);
      if (!concise.endsWith('.')) concise += '.';

      return {
        improvedText: concise,
        tip: 'Removed passive filler phrases for stronger ATS impact.'
      };
    }

    // 3. Action: Action Verb
    if (action === 'action_verb') {
      const words = trimmed.replace(/^(I |We |They |Was |Have )\b/i, '').split(' ');
      const randomVerb = STRONG_VERBS[Math.floor(Math.random() * STRONG_VERBS.length)];
      
      words[0] = randomVerb;
      let result = words.join(' ');
      if (!result.endsWith('.')) result += '.';

      return {
        improvedText: result,
        tip: `Replaced starting phrase with high-impact action verb "${randomVerb}".`
      };
    }

    // 4. Action: Add Impact / Quantifiable Metric (Default for bullet points)
    if (action === 'add_impact') {
      // Clean filler opening
      let polished = trimmed
        .replace(/\b(responsible for|in order to|worked on|helped with|tasked with|assisted in|was involved in)\b/gi, '')
        .replace(/^(I |We |They |Was )\b/i, '')
        .trim();

      // Ensure starts with strong action verb
      const firstWord = polished.split(' ')[0] || '';
      const startsWithStrongVerb = STRONG_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
      if (!startsWithStrongVerb) {
        const randomVerb = STRONG_VERBS[Math.floor(Math.random() * STRONG_VERBS.length)];
        polished = `${randomVerb} ${polished.charAt(0).toLowerCase() + polished.slice(1)}`;
      } else {
        polished = polished.charAt(0).toUpperCase() + polished.slice(1);
      }

      // Check if text already has numeric metrics (%, numbers, etc.)
      const hasNumber = /\d+/.test(polished);
      if (!hasNumber) {
        const randomMetric = METRICS_POOL[Math.floor(Math.random() * METRICS_POOL.length)];
        polished = polished.replace(/\.$/, '');
        polished = `${polished}, ${randomMetric}.`;
      } else {
        if (!polished.endsWith('.')) polished += '.';
      }

      return {
        improvedText: polished,
        tip: 'Enhanced achievement bullet with active verbs and quantifiable impact.'
      };
    }

    // 5. Action: Tailor to Job
    if (action === 'tailor_to_job' && jobContext) {
      return {
        improvedText: `${trimmed.replace(/\.$/, '')} (aligned with ${jobContext.slice(0, 30)} requirements).`,
        tip: 'Tailored terminology to match target role expectations.'
      };
    }

    // Default general improvement
    let formatted = trimmed.replace(/^(I |We |They )/i, '').replace(/\.$/, '') + '.';
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    return {
      improvedText: formatted,
      tip: 'Formatted into standard professional third-person action statement.'
    };
  },

  // AI summary generator assistance
  generateSummary: async ({ title = '', experienceYears = '5+', topSkills = [] }) => {
    await new Promise(res => setTimeout(res, 400));
    const roleTitle = title || 'Software Engineer';
    const skillsList = Array.isArray(topSkills) && topSkills.length > 0
      ? topSkills.slice(0, 5).join(', ')
      : 'React, TypeScript, Node.js, and Modern Web Architecture';

    return `Results-driven ${roleTitle} with ${experienceYears} of experience engineering high-performance, scalable applications using ${skillsList}. Proven track record of spearheading system optimizations, reducing latency by over 35%, and collaborating in cross-functional agile teams to deliver mission-critical features.`;
  }
};
