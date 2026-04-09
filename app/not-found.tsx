import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This page does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <main className='mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-2xl font-semibold text-pastel-ink'>404</h1>
      <p className='text-pastel-ink/80'>
        We could not find that page.
      </p>
      <Link
        href='/'
        className='rounded-lg border-2 border-pastel-stroke bg-pastel-lilac px-4 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-lilac-hover'
      >
        Back home
      </Link>
    </main>
  );
}
