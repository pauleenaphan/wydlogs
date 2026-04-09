import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAppSession } from '@/lib/auth';
import LogoutButton from './logout-button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Sign out and manage your WydLogs session.',
};

export default async function SettingsPage() {
  const session = await getAppSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className='mx-auto w-3/5 space-y-6 p-4'>
      <h1 className='font-semibold text-2xl'>Settings</h1>
      <LogoutButton />
    </div>
  );
}
