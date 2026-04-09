'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Popover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import LogList from '@/app/components/LogList';
import type { DashboardLog } from '@/app/components/LogList';
import type { CategorySelectOption } from '@/lib/category-select-options';
import { formatDateKey, parseDateKey } from '@/lib/date-utils';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

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
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const selected = parseDateKey(dateKey);
  const label = format(selected, 'MMMM d, yyyy');

  return (
    <div className='mx-auto w-3/5 space-y-4 p-4'>
      <h1 className='font-semibold'>Select a date to see your log history</h1>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          type='button'
          className={cn(
            'group flex min-h-11 w-full max-w-xs items-center justify-between gap-2 rounded-lg border-2 border-zinc-900 bg-white px-3 py-2 text-left text-sm',
          )}
        >
          <span>{label}</span>
          <ChevronDownIcon
            className='size-5 shrink-0 text-zinc-700 transition-transform duration-200 group-data-[popup-open]:rotate-180'
            aria-hidden
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side='bottom' sideOffset={8} align='start'>
            <Popover.Popup
              className='origin-[var(--transform-origin)] rounded-lg border-2 border-zinc-900 bg-white p-0 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'
              initialFocus={false}
            >
              <Calendar
                mode='single'
                selected={selected}
                onSelect={(d) => {
                  if (d) {
                    router.replace(`/history?date=${formatDateKey(d)}`);
                  }
                  setOpen(false);
                }}
                className='rounded-lg border-0'
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <section className='mt-6'>
        <h2 className='mb-3 font-semibold'>Logs</h2>
        {logs.length === 0 ? (
          <p className='text-zinc-600'>No logs on this day.</p>
        ) : (
          <LogList logs={logs} categoryOptions={categoryOptions} />
        )}
      </section>
    </div>
  );
}
