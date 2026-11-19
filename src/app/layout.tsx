import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://rudar.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rudar Sharma | Portfolio & OS',
    template: '%s | Rudar Sharma',
  },
  description:
    'Personal portfolio and interactive operating system workspace of Rudar Sharma — full-stack developer, robotics engineer, and AI builder.',
  keywords: [
    'Rudar Sharma',
    'Rudar',
    'Portfolio',
    'Developer',
    'Web Development',
    'Robotics',
    'AI',
    'Full-Stack Developer',
    'React',
    'Next.js',
    'SafeWare',
  ],
  authors: [{ name: 'Rudar Sharma', url: siteUrl }],
  creator: 'Rudar Sharma',
  publisher: 'Rudar Sharma',
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Rudar Sharma | Portfolio & OS',
    description:
      'Personal portfolio and interactive operating system workspace of Rudar Sharma — full-stack developer, robotics engineer, and AI builder.',
    siteName: 'Rudar Sharma Portfolio',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Rudar Sharma Portfolio OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rudar Sharma | Portfolio & OS',
    description:
      'Personal portfolio and interactive operating system workspace of Rudar Sharma — full-stack developer, robotics engineer, and AI builder.',
    creator: '@rudarsharma',
    images: ['/icon.png'],
  },
  verification: {
    google: [
      'a8o9f-bni2TtGKB_EyA90Y3SJB3ImX-UF6El-PIJO_8',
      'google1f41b1455940f20c',
    ],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Rudar Sharma',
      url: siteUrl,
      jobTitle: 'Full-Stack Developer & Robotics Engineer',
      sameAs: [
        'https://github.com/rudarsharma382-cell',
        'https://linkedin.com/in/rudarsharma-dev',
      ],
      description:
        'Student developer in Delhi building web applications, AI models, and robotics hardware.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Rudar Sharma Portfolio',
      description:
        'Personal portfolio and interactive operating system workspace of Rudar Sharma.',
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="google-site-verification"
          content="a8o9f-bni2TtGKB_EyA90Y3SJB3ImX-UF6El-PIJO_8"
        />
        <meta
          name="google-site-verification"
          content="google1f41b1455940f20c"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-surface-canvas text-content-primary antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
