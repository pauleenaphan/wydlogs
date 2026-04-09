'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      type='button'
      className='rounded-lg border-2 border-pastel-stroke bg-card px-6 py-2 text-pastel-ink transition-colors hover:bg-pastel-lilac'
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Log out
    </button>
  );
}
