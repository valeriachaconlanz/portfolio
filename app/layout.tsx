import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Archivo_Black } from 'next/font/google';
import { profile } from '@/content/profile';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CommandPalette } from '@/components/CommandPalette';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--mono', display: 'swap' });
// Archivo Black only ships one weight (400, which is already heavy) — the
// giant brutalist wordmark and section headings use this instead of --sans.
const display = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--display',
  display: 'swap',
});

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
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <CommandPalette />
      </body>
    </html>
  );
}
