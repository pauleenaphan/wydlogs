import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ReportClient from './report-client';
import { getAppSession } from '@/lib/auth';
import {
  formatMonthKey,
  monthRangeFromKey,
  parseMonthKey,
} from '@/lib/date-utils';
import { getLogs } from '@/lib/logs';

type Props = {
  searchParams: Promise<{ month?: string }>;
};

export const metadata: Metadata = {
  title: 'Report',
  description:
    'Monthly totals: hours logged and a breakdown by category for the month you choose.',
};

function hoursByCategory(logs: { category: string }[]) {
  const counts = new Map<string, number>();
  for (const log of logs) {
    counts.set(log.category, (counts.get(log.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, hours]) => ({ category, hours }))
    .sort((a, b) => b.hours - a.hours || a.category.localeCompare(b.category));
}

export default async function ReportPage({ searchParams }: Props) {
  const session = await getAppSession();
  if (!session?.user || !('id' in session.user)) {
    redirect('/auth/signin');
  }
  const userId = session.user.id as string;
  const { month } = await searchParams;
  const monthKey = formatMonthKey(parseMonthKey(month?.trim() ?? ''));
  const { from, to } = monthRangeFromKey(monthKey);
  const logs = await getLogs(userId, { from, to });

  return (
    <ReportClient
      monthKey={monthKey}
      totalHours={logs.length}
      byCategory={hoursByCategory(logs)}
    />
  );
}
