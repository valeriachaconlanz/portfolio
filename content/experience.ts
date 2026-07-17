import type { City, Role } from '@/lib/types';

export const SEATTLE: City = { name: 'Seattle', state: 'WA', lat: 47.6, lon: -122.3 };
export const SAN_JOSE: City = { name: 'San Jose', state: 'CA', lat: 37.3, lon: -121.9 };
export const MIAMI: City = { name: 'Miami', state: 'FL', lat: 25.8, lon: -80.2 };

export const roles: Role[] = [
  {
    id: 'amazon-2026',
    org: 'Amazon',
    title: 'SDE Intern · Connections',
    city: SEATTLE,
    start: 'May 2026',
    end: null,
    bullets: [
      'Building an internal tool that cuts an administrator task from 30 minutes to 10 seconds — roughly a 180× speedup.',
      'Designed the data model on DynamoDB and provisioned infrastructure as code with AWS CDK.',
      'Instrumented the service with CloudWatch, and applied AI tooling to the workflow it replaces.',
      'Participates in team code reviews.',
    ],
    stack: ['Java', 'DynamoDB', 'AWS CDK', 'CloudWatch'],
    isAmazon: true,
  },
  {
    id: 'amazon-2025',
    org: 'Amazon',
    title: 'SDE Intern · Annual Compensation (PXT)',
    city: SEATTLE,
    start: 'May 2025',
    end: 'August 2025',
    bullets: [
      'Engineered and deployed RESTful APIs automating Annual Compensation team workflows, cutting manual processing time by up to 40%.',
      'Led 80% of the front-end build in React and Stencil, delivering responsive dashboards that improved task visibility.',
      'Supported backend development in Java, integrating secure services across high-volume data operations.',
      'Worked cross-functionally with Program Managers and System Admins to align the build with business goals.',
    ],
    stack: ['Java', 'React', 'Stencil', 'REST'],
    isAmazon: true,
  },
  {
    id: 'aws-2024',
    org: 'AWS',
    title: 'SDE Intern',
    city: SAN_JOSE,
    start: 'May 2024',
    end: 'August 2024',
    bullets: [
      'Built a customizable API for the Amazon Q tool in Java, letting customers tailor their AI service usage — cutting service-integration time and cost by ~30%.',
      'Designed the API alongside senior engineers, testing with Insomnia and automating deployment through Amazon Pipelines.',
      'Reviewed design proposals with product managers and senior engineers.',
    ],
    stack: ['Java', 'Brazil', 'Insomnia', 'Amazon Pipelines'],
    isAmazon: true,
  },
  {
    id: 'fifa-2024',
    org: 'FIFA World Cup 2026',
    title: 'Venue Technology Intern',
    city: MIAMI,
    start: 'September 2024',
    end: 'November 2024',
    bullets: [
      'Designed and launched a landing page for the 2026 World Cup.',
      'Rebuilt a longstanding stadium data-collection form used across venues.',
      'Coordinated venue technology requirements with stadium staff.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    isAmazon: false,
  },
  {
    id: 'init-president',
    org: 'INIT MDC Kendall',
    title: 'President',
    city: MIAMI,
    start: 'August 2024',
    end: 'May 2025',
    bullets: [
      'Managed $10K in external funding, keeping the chapter financially sustainable.',
      'Built and led web development and GitHub workshops for over 100 active members.',
      'Led marketing for SeedAI Hackathon, one of Miami’s largest.',
      'On the e-board since November 2023.',
    ],
    stack: [],
    isAmazon: false,
  },
  {
    id: 'init-reach',
    org: 'INIT MDC Kendall',
    title: 'Reach Program Manager',
    city: MIAMI,
    start: 'October 2023',
    end: 'July 2024',
    bullets: [
      'Co-taught career and technical workshops, including GitHub and web development sessions.',
      'Mentored students toward engineering careers with individually tailored plans.',
    ],
    stack: [],
    isAmazon: false,
  },
  {
    id: 'gwc-2022',
    org: 'Girls Who Code',
    title: 'Summer Immersion Scholar',
    city: MIAMI,
    start: 'June 2022',
    end: 'June 2022',
    bullets: [
      'Selected for the Raytheon-sponsored immersion program, building software through intensive project work.',
    ],
    stack: [],
    isAmazon: false,
  },
];

export const amazonReturnCount = roles.filter((r) => r.isAmazon).length;
