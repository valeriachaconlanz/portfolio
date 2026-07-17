import type { Award, School } from '@/lib/types';

export const schools: School[] = [
  {
    name: 'Florida International University',
    credential: 'BS, Computer Science',
    detail: null,
    start: 'July 2025',
    end: 'May 2027',
  },
  {
    name: 'The Honors College at Miami Dade College',
    credential: 'AA, Computer Science',
    detail: 'Full-ride fellowship',
    start: 'August 2023',
    end: 'May 2025',
  },
  {
    name: 'Florida International University',
    credential: 'Dual Enrollment, Computer Science',
    detail: '4.00 GPA · FLAME program',
    start: 'September 2022',
    end: 'June 2023',
  },
  {
    name: 'Miami Coral Park Senior High',
    credential: 'Engineering Magnet, Computer Science',
    detail: 'Summa Cum Laude · top 10%',
    start: 'August 2019',
    end: 'June 2023',
  },
];

export const awards: Award[] = [
  { label: 'Amazon Future Engineer Scholarship', detail: '$40,000' },
  { label: 'Honors College Fellowship', detail: 'Full ride, two years' },
  { label: 'Academic Excellence Award', detail: 'Technology Faculty' },
  { label: 'Dean’s List', detail: '×2' },
  { label: 'Civic Action Award', detail: 'Bronze' },
];
