import type { Project } from '@/lib/types';

export const sproutfund: Project = {
  name: 'SproutFund',
  tagline: 'An AI investment advisor for people opening their first brokerage account.',
  description:
    'Users enter a budget, a timeline, and a risk tolerance. Claude generates a personalized strategy — real fund names, allocation percentages, and where to actually open the account. Plans can be saved, renamed, and revisited.',
  repo: 'https://github.com/valeriachaconlanz/SproutFund',
  screenshot: '/sproutfund-home.png',
  credit: 'Led a 4-person team · repo owner · 51 of 76 commits',
  stack: [
    { label: 'Frontend', items: ['React 19', 'Vite', 'React Router 7', 'CSS'] },
    { label: 'Backend', items: ['Java 17', 'Spring Boot 3', 'Maven'] },
    { label: 'AI', items: ['Anthropic Claude API'] },
    { label: 'Data & Auth', items: ['Supabase', 'Postgres', 'JWT', 'Row-level security'] },
  ],
};
