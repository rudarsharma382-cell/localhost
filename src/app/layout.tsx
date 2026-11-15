import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rudar OS',
  description: 'A personal portfolio that works as a custom operating system.',
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
      </head>
      <body className="min-h-screen bg-surface-canvas text-content-primary antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
