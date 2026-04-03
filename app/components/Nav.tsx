'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className='flex items-center justify-center gap-6 p-4 border-b-2 mb-8'>
      <Link href='/'> Home </Link>
      <Link href='/history'> History </Link>
      <Link href='/report'> Report </Link>
      <Link href='/settings'> Settings </Link>
    </div>
  );
}
