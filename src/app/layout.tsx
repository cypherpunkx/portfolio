import type { Metadata } from 'next';
import './globals.css';
import { mono } from './fonts';

export const metadata: Metadata = {
  title: 'Brutalist Portfolio',
  description: 'Monochrome, grid-first brutalist portfolio landing page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mono.className}>{children}</body>
    </html>
  );
}
