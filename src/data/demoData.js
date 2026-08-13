export const demoResumes = [
  {
    id: 'res_1',
    name: 'Frontend_Developer_Senior.pdf',
    targetRole: 'Senior Frontend Engineer',
    templateId: 'template_01',
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    atsScore: 84,
    personalInfo: {
      fullName: 'Alex Morgan',
      professionalTitle: 'Senior Frontend Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmorgan-dev',
      github: 'github.com/alexmorgan-dev',
      portfolio: 'alexmorgan.dev'
    },
    summary: 'Results-driven Senior Frontend Engineer with 6+ years of experience architecting high-performance web applications using React, TypeScript, Next.js, and modern CSS architecture. Proven track record in reducing bundle sizes by 40% and improving Core Web Vitals across high-traffic SaaS platforms.',
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'Lead Frontend Engineer',
        company: 'Vanguard Digital Solutions',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        currentPosition: true,
        description: 'Architecting scalable web applications and leading a team of 6 engineers across front-end infrastructure and design system initiatives.',
        achievements: [
          'Engineered micro-frontend architecture using React and Vite, accelerating CI/CD pipeline deployments by 45%.',
          'Spearheaded design system refactoring, decreasing component library bundle size by 38KB and improving accessible WCAG compliance to 100%.',
          'Mentored 4 junior engineers through pair programming and structured code reviews, resulting in a 25% reduction in production bug reports.'
        ]
      },
      {
        id: 'exp_2',
        jobTitle: 'Frontend Developer',
        company: 'Apex Cloud Systems',
        location: 'Austin, TX',
        startDate: '2019-06',
        endDate: '2022-02',
        currentPosition: false,
        description: 'Built real-time telemetry dashboards and interactive data visualizations for cloud infrastructure monitoring.',
        achievements: [
          'Developed responsive analytics UI with React and Recharts handling over 100k data points per second with sub-60ms render times.',
          'Migrated legacy jQuery codebase to TypeScript and modern React hooks, elevating unit test coverage from 15% to 88%.',
          'Collaborated with UX designers to implement accessible dark/light theme systems with zero layout shift.'
        ]
      }
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2015-08',
        endDate: '2019-05',
        gpa: '3.85 / 4.0',
        coursework: 'Data Structures, Algorithms, Distributed Systems, Software Engineering'
      }
    ],
    skills: {
      programming: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3/SASS', 'SQL'],
      frameworks: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
      tools: ['Git', 'Docker', 'Webpack', 'Jest', 'Playwright', 'Figma'],
      cloud: ['AWS (S3, CloudFront)', 'Firebase', 'Vercel'],
      softSkills: ['Agile Development', 'Cross-functional Collaboration', 'Technical Leadership', 'Code Review']
    },
    projects: [
      {
        id: 'proj_1',
        name: 'Nexus Analytics Dashboard',
        description: 'Open-source real-time developer monitoring tool built with React and WebSockets.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
        projectUrl: 'https://nexus-demo.example.com',
        githubUrl: 'https://github.com/alexmorgan-dev/nexus',
        achievements: [
          'Starred by 1.2k GitHub developers within 3 months of initial release.',
          'Integrated automated end-to-end testing pipeline with GitHub Actions.'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        date: '2023-04',
        credentialUrl: 'https://aws.amazon.com/verification'
      }
    ],
    languages: [
      { id: 'lang_1', name: 'English', proficiency: 'Native' },
      { id: 'lang_2', name: 'Spanish', proficiency: 'Conversational' }
    ]
  },
  {
    id: 'res_2',
    name: 'FullStack_Software_Engineer.pdf',
    targetRole: 'Full Stack Engineer',
    templateId: 'template_04',
    updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 40).toISOString(),
    atsScore: 78,
    personalInfo: {
      fullName: 'Alex Morgan',
      professionalTitle: 'Full Stack Software Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA'
    },
    summary: 'Versatile Full Stack Engineer with expertise in building API-driven web solutions, serverless backends, and responsive user interfaces.',
    experience: [],
    education: [],
    skills: {
      programming: ['Node.js', 'Python', 'Go', 'React', 'PostgreSQL'],
      frameworks: ['Express', 'Next.js', 'FastAPI'],
      tools: ['Git', 'Docker', 'Kubernetes', 'CI/CD']
    },
    projects: [],
    certifications: [],
    languages: []
  }
];

export const demoAnalyses = [
  {
    id: 'ana_1',
    resumeId: 'res_1',
    resumeName: 'Frontend_Developer_Senior.pdf',
    atsScore: 84,
    compatibilityLabel: 'Strong ATS Compatibility',
    scores: {
      atsCompatibility: 92,
      keywordMatch: 78,
      contentQuality: 85,
      skillsCoverage: 81,
      formatting: 94
    },
    criticalIssues: [
      {
        id: 'iss_1',
        title: 'Two-Column Layout Risk',
        severity: 'high',
        explanation: 'Certain legacy ATS parsers (Taleo, Workday v1) may misread contact info or side columns.',
        recommendedFix: 'Use standard single-column structure for top contact headers.'
      }
    ],
    improvements: [
      {
        id: 'imp_1',
        title: 'Add Cloud Infrastructure Metrics',
        severity: 'medium',
        explanation: 'Your AWS certification is listed, but your work experience lacks explicit AWS impact numbers.',
        recommendedFix: 'Include specific numbers around cloud latency or AWS deployment frequency.'
      },
      {
        id: 'imp_2',
        title: 'Include Docker & GraphQL Keywords',
        severity: 'low',
        explanation: 'Target senior frontend jobs often look for containerization and modern API query skills.',
        recommendedFix: 'Integrate Docker and GraphQL experience into your project bullets.'
      }
    ],
    strengths: [
      'Strong action verbs at the beginning of bullet points (Engineered, Spearheaded, Mentored).',
      'Quantifiable metrics included across experience entries (45% acceleration, 38KB reduction).',
      'Clear, standard section headings (Experience, Education, Skills, Projects).'
    ],
    keywordDistribution: [
      { keyword: 'React', status: 'found', count: 6 },
      { keyword: 'TypeScript', status: 'found', count: 4 },
      { keyword: 'REST APIs', status: 'found', count: 3 },
      { keyword: 'Tailwind CSS', status: 'found', count: 2 },
      { keyword: 'Docker', status: 'missing', count: 0 },
      { keyword: 'GraphQL', status: 'missing', count: 0 },
      { keyword: 'AWS', status: 'partial', count: 1 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const demoJobs = [
  {
    id: 'job_1',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'Remote / San Francisco',
    matchScore: 87,
    scoreBreakdown: {
      skills: 91,
      experience: 82,
      keywords: 88,
      education: 100,
      responsibilities: 84
    },
    matchingSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git', 'Vite', 'Testing'],
    missingSkills: ['GraphQL', 'Next.js 14 App Router', 'Web Workers', 'Performance Profiling'],
    recommendations: [
      'Highlight Next.js App Router experience in your summary section.',
      'Add performance profiling examples under Vanguard Digital Solutions.'
    ],
    description: `About the Role:
We are looking for a Senior Frontend Engineer to join our Payment UI Platform team. You will craft scalable web applications, improve performance metrics across merchant dashboards, and mentor junior engineers.

Requirements:
- 5+ years building modern client-side applications with React and TypeScript.
- Strong proficiency in web performance optimization, bundle analysis, and Core Web Vitals.
- Deep understanding of CSS architecture, design systems, and responsive design.
- Experience with GraphQL, REST APIs, and state management solutions.
- Excellent communication and technical leadership skills.`,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const demoTemplates = [
  {
    id: 'template_01',
    name: 'Classic',
    tagline: 'Single column, maximum ATS parsing reliability.',
    category: 'ATS Essential',
    atsSafe: true,
    accentColor: '#111111',
    description: 'Designed specifically for strict corporate applicant tracking systems like Workday, Taleo, and Greenhouse.'
  },
  {
    id: 'template_02',
    name: 'Executive',
    tagline: 'Clean header layout for mid to senior leaders.',
    category: 'Leadership',
    atsSafe: true,
    accentColor: '#1E3A8A',
    description: 'Refined serif typography paired with standard ATS section flow.'
  },
  {
    id: 'template_03',
    name: 'Modern',
    tagline: 'Subtle accent divider with clean hierarchy.',
    category: 'SaaS & Tech',
    atsSafe: true,
    accentColor: '#0284C7',
    description: 'Sleek modern typography, highly readable by recruiters and automated screeners.'
  },
  {
    id: 'template_04',
    name: 'Technical',
    tagline: 'Optimized for software engineers and architects.',
    category: 'Engineering',
    atsSafe: true,
    accentColor: '#15803D',
    description: 'Prominently features tech stack tags, project repositories, and quantifiable achievements.'
  },
  {
    id: 'template_05',
    name: 'Graduate',
    tagline: 'Education and project focused layout for students.',
    category: 'Early Career',
    atsSafe: true,
    accentColor: '#B45309',
    description: 'Ideal for recent graduates emphasizing degrees, honors, coursework, and personal projects.'
  },
  {
    id: 'template_06',
    name: 'Professional',
    tagline: 'Universal corporate standard for all industries.',
    category: 'Corporate',
    atsSafe: true,
    accentColor: '#374151',
    description: 'Timeless, clean formatting suitable for finance, consulting, software, and healthcare.'
  }
];
