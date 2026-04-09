import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SignInForm from '@/app/components/SignInForm';
import { getAppSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in with GitHub to return to your dashboard. Used when the app redirects you here to authenticate.',
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AuthSignInPage({ searchParams }: Props) {
  const session = await getAppSession();
  if (session) {
    redirect('/dashboard');
  }

  const { callbackUrl, error } = await searchParams;

  return (
    <main className='flex min-h-dvh flex-col items-center justify-center px-4 py-16'>
      <SignInForm callbackUrl={callbackUrl} error={error} />
    </main>
  );
}
