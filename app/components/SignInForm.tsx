'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start sign-in. Try again.',
  OAuthCallback: 'Something went wrong after GitHub redirected back.',
  OAuthCreateAccount: 'Could not create an account from this GitHub profile.',
  Callback: 'Sign-in was cancelled or failed.',
  OAuthAccountNotLinked:
    'This GitHub account is already linked to a different login.',
  AccessDenied: 'You denied access or sign-in was not allowed.',
  Default: 'Sign-in failed. Please try again.',
};

type Props = {
  callbackUrl?: string;
  error?: string;
  /** When false, hides the “Back home” link (e.g. on `/`). @default true */
  showBackHome?: boolean;
};

function safeCallbackUrl(url: string | undefined) {
  if (url && url.startsWith('/') && !url.startsWith('//')) return url;
  return '/dashboard';
}

export default function SignInForm({
  callbackUrl,
  error,
  showBackHome = true,
}: Props) {
  const target = safeCallbackUrl(callbackUrl);
  const errorText = error
    ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default)
    : null;

  return (
    <div className='panel-surface w-full max-w-md space-y-6 rounded-xl p-8'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>wydlogs</h1>
        <p className='text-sm text-pastel-ink/80'>
          Sign in with GitHub to save and review what you worked on, hour by
          hour.
        </p>
      </div>

      {errorText ? (
        <p
          className='rounded-lg border-2 border-pastel-danger bg-pastel-danger-soft px-3 py-2 text-center text-sm text-pastel-danger-ink'
          role='alert'
        >
          {errorText}
        </p>
      ) : null}

      <button
        type='button'
        className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-pastel-stroke bg-pastel-pink px-4 py-3 text-sm font-medium text-pastel-ink transition-colors hover:bg-pastel-surface-hover'
        onClick={() => signIn('github', { callbackUrl: target })}
      >
        <GitHubMark className='size-5 shrink-0' aria-hidden />
        Continue with GitHub
      </button>

      <p className='text-center text-xs text-pastel-ink/60'>
        We only use your GitHub account to identify you. No repos or private
        data are accessed beyond your public profile and email.
      </p>

      {showBackHome ? (
        <div className='border-t border-pastel-stroke/40 pt-4 text-center'>
          <Link
            href='/'
            className='text-sm font-medium text-pastel-ink underline-offset-4 transition-colors hover:text-pastel-ink/60 hover:underline'
          >
            ← Back home
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 98 96'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.225-22.23-5.38-22.23-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
      />
    </svg>
  );
}
