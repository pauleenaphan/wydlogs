import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Script from 'next/script';

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
        <Script
          src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
          strategy='lazyOnload'
        />
        <Script id='onesignal-init' strategy='lazyOnload'>
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function (OneSignal) {
              await OneSignal.init({ appId: '${process.env.ONESIGNAL_APP_ID}' });
            });
          `}
        </Script>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
