import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CategorySelect from '@/app/components/CategorySelect';
import Input from '@/app/components/Input';
import LogList from '@/app/components/LogList';
import ManageCategoriesModal from '@/app/components/ManageCategoriesModal';
import { getAppSession } from '@/lib/auth';
import { mergeCategorySelectOptions } from '@/lib/category-select-options';
import { getCategories } from '@/lib/category';
import {
  endOfDay,
  formatTime12h,
  formatWeekdayMonthDay,
  getNextSolidHour,
  startOfDay,
} from '@/lib/date-utils';
import { createLogs, getLogs } from '@/lib/logs';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Log this hour’s ticket and category, duplicate your last entry, and see today’s logs.',
};

export default async function Dashboard() {
  const session = await getAppSession();
  if (!session?.user || !('id' in session.user)) {
    redirect('/auth/signin');
  }
  const userId = session.user.id as string;
  const logs = await getLogs(userId, {
    from: startOfDay(),
    to: endOfDay(),
  });
  const categories = await getCategories(userId);
  const categorySelectOptions = mergeCategorySelectOptions(categories);
  const todayLabel = formatWeekdayMonthDay();
  const nextReminderLabel = formatTime12h(getNextSolidHour());

  return (
    <div className='w-3/5 p-4 mx-auto flex justify-between gap-12'>
      <section className='w-1/2'>
        <p className='font-bold text-xl'>{todayLabel}</p>
        <p className='mb-4'>
          {logs.length}/8 logged - Next reminder at {nextReminderLabel}
        </p>
        <div className='panel-surface flex flex-col gap-4 overflow-visible rounded-lg p-4'>
          <h1 className='font-semibold text-2xl'> Heyy, wyd rn? </h1>
          <form action={createLogs} className='flex flex-col gap-4'>
            <Input label='Ticket number' name='ticketNumber' required />
            <CategorySelect name='category' options={categorySelectOptions} />
            <button
              type='submit'
              className='rounded-lg border-2 border-pastel-stroke bg-pastel-pink px-6 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-lilac-hover'
            >
              Log
            </button>
          </form>
          <form action={createLogs} className='flex flex-col gap-2'>
            <input type='hidden' name='duplicateLast' value='1' />
            <button
              type='submit'
              className='rounded-lg border-2 border-pastel-stroke bg-pastel-sky px-6 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-lilac-hover'
            >
              Log same as last hour
            </button>
          </form>
          <ManageCategoriesModal categories={categories} />
        </div>
      </section>

      <section className='w-1/2'>
        <h2 className='font-semibold text-xl'>Today&apos;s logs</h2>
        <p className='mb-4'> Click the pencil to edit or trashcan to delete a log. </p>

        {logs.length === 0 ? (
          <p className='panel-surface rounded-lg px-4 py-10 text-center text-pastel-ink/70'>
            No logs yet
          </p>
        ) : (
          <LogList logs={logs} categoryOptions={categorySelectOptions} />
        )}
      </section>
    </div>
  );
}
