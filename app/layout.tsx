import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hiesenbug.dev'),
  title: {
    default: 'Arshdeep Singh',
    template: '%s · Arshdeep Singh',
  },
  description:
    'Systems developer working on storage engines, indexers, and database internals.',
  openGraph: {
    title: 'Arshdeep Singh',
    description:
      'Systems developer working on storage engines, indexers, and database internals.',
    url: 'https://hiesenbug.dev',
    siteName: 'Arshdeep Singh',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
  icons: {
    icon: '/memoji_title.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Paint the stored theme before first paint, otherwise dark users get a white flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}",
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
