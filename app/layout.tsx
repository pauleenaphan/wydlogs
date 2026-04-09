import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import Navbar from '@/app/components/Nav';
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';

const fontSans = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'WydLogs',
  description: 'Track your work hours',
  icons: {
    icon: '/wydLogLogo.png',
    apple: '/wydLogLogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={cn(fontSans.variable, 'font-sans')}>
      <body
        className={cn(fontSans.className, 'min-h-full flex flex-col antialiased')}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
