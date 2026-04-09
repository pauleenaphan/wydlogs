'use client';

import DateDropdown from '@/app/components/DateDropdown';
import LogList from '@/app/components/LogList';
import type { DashboardLog } from '@/app/components/LogList';
import type { CategorySelectOption } from '@/lib/category-select-options';

type Props = {
  dateKey: string;
  logs: DashboardLog[];
  categoryOptions: CategorySelectOption[];
};

export default function HistoryClient({
  dateKey,
  logs,
  categoryOptions,
}: Props) {
  return (
    <div className='mx-auto w-3/5 space-y-4 p-4'>
      <h1 className=''>Select a date to see your log history</h1>
      <DateDropdown dateKey={dateKey} />

      <section className='mt-6'>
        <h2 className='mb-4 font-semibold text-2xl'>Logs</h2>
        {logs.length === 0 ? (
          <p className='panel-surface rounded-lg px-4 py-10 text-center text-pastel-ink/70'>
            No logs on this day.
          </p>
        ) : (
          <LogList logs={logs} categoryOptions={categoryOptions} />
        )}
      </section>
    </div>
  );
}
