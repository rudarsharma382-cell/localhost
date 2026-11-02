import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rudar OS',
  description: 'A personal portfolio that works as a custom operating system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-canvas text-content-primary antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}

