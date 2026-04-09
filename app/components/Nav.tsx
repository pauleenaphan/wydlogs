'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinkClass =
  'rounded-lg px-3 py-1.5 text-pastel-ink transition-colors hover:bg-pastel-lilac';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/auth/signin')
    return null;

  return (
    <div className='mb-8 flex items-center justify-center gap-2 border-b border-pastel-stroke/35 bg-card/90 p-4 backdrop-blur-sm sm:gap-6'>
      <Link href='/dashboard' className={navLinkClass}>
        Home
      </Link>
      <Link href='/history' className={navLinkClass}>
        History
      </Link>
      <Link href='/report' className={navLinkClass}>
        Report
      </Link>
      <Link href='/settings' className={navLinkClass}>
        Settings
      </Link>
    </div>
  );
}
