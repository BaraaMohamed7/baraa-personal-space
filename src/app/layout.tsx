import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Baraa Mohamed — Personal Space',
  description: 'Software engineering, projects, ideas, and a little more about Baraa Mohamed.',
  openGraph: {
    title: 'Baraa Mohamed — Personal Space',
    description: 'Software engineering, projects, ideas, and a little more about me.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#081427',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&family=Cairo:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
