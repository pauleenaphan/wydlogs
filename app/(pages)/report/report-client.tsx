'use client';

import MonthDropdown from '@/app/components/MonthDropdown';

export type CategoryHoursRow = {
  category: string;
  hours: number;
};

type Props = {
  monthKey: string;
  totalHours: number;
  byCategory: CategoryHoursRow[];
};

export default function ReportClient({
  monthKey,
  totalHours,
  byCategory,
}: Props) {
  return (
    <div className='mx-auto w-3/5 space-y-4 p-4'>
      <h1 className='text-2xl font-bold'> Monthly Reports </h1>
      <MonthDropdown monthKey={monthKey} />

      <h1 className='text-xl pt-2 font-semibold'>Total hours by category</h1>
      {byCategory.length === 0 ? (
        <p className='text-pastel-ink/70'>No logs this month.</p>
      ) : (
        <ul className='panel-surface divide-y divide-pastel-stroke/40 rounded-lg'>
          {byCategory.map((row) => (
            <li
              key={row.category}
              className='flex items-center justify-between p-3'
            >
              <span className='font-medium'>{row.category}</span>
              <span className='tabular-nums text-pastel-ink/80'>
                {row.hours}{' '}
                {row.hours === 1 ? 'hour' : 'hours'}
              </span>
            </li>
          ))}
          <li className='flex items-center justify-between bg-pastel-surface/50 p-3 font-semibold text-pastel-ink'>
            <span>Total</span>
            <span className='tabular-nums'>
              {totalHours} {totalHours === 1 ? 'hour' : 'hours'}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
