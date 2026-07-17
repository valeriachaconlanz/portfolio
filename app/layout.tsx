import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/content/profile';
import { SmoothScroll } from '@/components/SmoothScroll';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${profile.name} — Software Engineer`,
  description: `${profile.headline}. Building an internal tool at Amazon that turns a 30-minute task into 10 seconds.`,
  openGraph: {
    title: `${profile.name} — Software Engineer`,
    description: profile.headline,
    type: 'profile',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
