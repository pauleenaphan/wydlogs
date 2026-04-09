import type { Metadata } from 'next';
import { IBM_Plex_Sans, Inter } from 'next/font/google';

import Navbar from '@/app/components/Nav';
import { Providers } from './providers';
import './globals.css';
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang='en' className={cn("font-sans", inter.variable)}>
      <body className={`${fontSans.className} min-h-full flex flex-col antialiased`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
