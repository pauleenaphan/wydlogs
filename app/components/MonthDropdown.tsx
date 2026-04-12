'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Popover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import { formatMonthKey, parseMonthKey } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

type Props = {
  monthKey: string;
  className?: string;
};

/** Month + year picker styled like {@link DateDropdown}; updates `?month=yyyy-MM`. */
export default function MonthDropdown({ monthKey, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const anchor = parseMonthKey(monthKey);
  const [viewYear, setViewYear] = React.useState(() => anchor.getFullYear());

  React.useEffect(() => {
    setViewYear(parseMonthKey(monthKey).getFullYear());
  }, [monthKey]);

  const selectedYear = anchor.getFullYear();
  const selectedMonth = anchor.getMonth();
  const label = format(anchor, 'MMMM yyyy');

  function selectMonth(monthIndex: number) {
    const d = new Date(viewYear, monthIndex, 1);
    router.replace(`${pathname}?month=${formatMonthKey(d)}`);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        type='button'
        className={cn(
          'group flex min-h-11 w-full max-w-xs items-center justify-between gap-2 rounded-lg border-2 border-pastel-stroke bg-white px-3 py-2 text-left text-sm text-pastel-ink transition-colors hover:bg-pastel-lilac',
          className,
        )}
      >
        <span>{label}</span>
        <ChevronDownIcon
          className='size-5 shrink-0 text-pastel-ink/70 transition-transform duration-200 group-data-[popup-open]:rotate-180'
          aria-hidden
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side='bottom' sideOffset={8} align='start'>
          <Popover.Popup
            className='origin-[var(--transform-origin)] w-[min(100vw-2rem,18rem)] rounded-lg border-2 border-pastel-stroke bg-white p-3 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'
            initialFocus={false}
          >
            <div className='mb-3 flex items-center justify-between gap-2'>
              <button
                type='button'
                className='rounded-lg border-2 border-pastel-stroke p-1.5 text-pastel-ink transition-colors hover:bg-pastel-lilac'
                aria-label='Previous year'
                onClick={() => setViewYear((y) => y - 1)}
              >
                <ChevronLeftIcon className='size-5' aria-hidden />
              </button>
              <span className='min-w-[4ch] text-center text-sm font-semibold tabular-nums text-pastel-ink'>
                {viewYear}
              </span>
              <button
                type='button'
                className='rounded-lg border-2 border-pastel-stroke p-1.5 text-pastel-ink transition-colors hover:bg-pastel-lilac'
                aria-label='Next year'
                onClick={() => setViewYear((y) => y + 1)}
              >
                <ChevronRightIcon className='size-5' aria-hidden />
              </button>
            </div>
            <div className='grid grid-cols-3 gap-1.5'>
              {MONTHS_SHORT.map((name, monthIndex) => {
                const isSelected =
                  viewYear === selectedYear && monthIndex === selectedMonth;
                return (
                  <button
                    key={name}
                    type='button'
                    className={cn(
                      'rounded-md border-2 py-2 text-center text-sm font-medium text-pastel-ink transition-colors',
                      isSelected
                        ? 'border-pastel-stroke bg-pastel-ink text-white'
                        : 'border-transparent hover:bg-pastel-lilac',
                    )}
                    onClick={() => selectMonth(monthIndex)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
