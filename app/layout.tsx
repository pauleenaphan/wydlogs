import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import Navbar from '@/app/components/Nav';
import { Providers } from './providers';
import './globals.css';

const fontSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'wydlogs',
  description: 'wydlogs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${fontSans.className} min-h-full flex flex-col antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
