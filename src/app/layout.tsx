import type { Metadata } from 'next';
import './globals.css';
import { mono } from './fonts';

export const metadata: Metadata = {
  title: 'Rafly Mahendra',
  description: 'Portfolio',
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
