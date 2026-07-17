import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { profile } from '@/content/profile';
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

// Runs before first paint (blocking, before hydration) so the DOM already
// reflects the user's motion preference as early as physically possible.
// This is the no-flash pattern next-themes uses for dark mode, applied to
// prefers-reduced-motion: the server cannot know this preference, so instead
// of guessing we read it client-side as early as possible and stash it as a
// data attribute on <html>.
//
// Uses next/script's "beforeInteractive" strategy rather than a raw <script>
// tag: Next.js injects beforeInteractive scripts into the initial HTML
// through its own machinery, outside normal React reconciliation. A plain
// <script> rendered directly in JSX works for the initial SSR paint, but if
// React ever falls back to a full client-side re-render of this subtree (as
// it does on any hydration mismatch elsewhere in the tree), React tries to
// re-render that <script> element itself, logs "Scripts inside React
// components are never executed when rendering on the client", and can wipe
// the very attribute the script had already set. beforeInteractive avoids
// that failure mode entirely.
const NO_FLASH_MOTION_SCRIPT = `(function(){try{var m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.setAttribute('data-motion',m?'reduce':'ok');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <Script id="no-flash-motion" strategy="beforeInteractive">
          {NO_FLASH_MOTION_SCRIPT}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
