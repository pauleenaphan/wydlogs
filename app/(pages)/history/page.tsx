import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HistoryClient from './history-client';
import { getAppSession } from '@/lib/auth';
import { mergeCategorySelectOptions } from '@/lib/category-select-options';
import { getCategories } from '@/lib/category';
import {
  endOfDay,
  formatDateKey,
  parseDateKey,
  startOfDay,
} from '@/lib/date-utils';
import { getLogs } from '@/lib/logs';

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export const metadata: Metadata = {
  title: 'History',
  description: 'Pick any day and review or edit the logs you saved.',
};

export default async function HistoryPage({ searchParams }: Props) {
  const session = await getAppSession();
  if (!session?.user || !('id' in session.user)) {
    redirect('/auth/signin');
  }
  const userId = session.user.id as string;
  const { date } = await searchParams;
  const dateKey = date?.trim() || formatDateKey(new Date());
  const day = parseDateKey(dateKey);
  const logs = await getLogs(userId, {
    from: startOfDay(day),
    to: endOfDay(day),
  });
  const categories = await getCategories(userId);
  const categorySelectOptions = mergeCategorySelectOptions(categories);

  return (
    <HistoryClient
      dateKey={dateKey}
      logs={logs}
      categoryOptions={categorySelectOptions}
    />
  );
}
