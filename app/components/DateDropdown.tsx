'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Popover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import { formatDateKey, parseDateKey } from '@/lib/date-utils';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type Props = {
  dateKey: string;
  className?: string;
};

/** Same date popover + calendar as history; updates `?date=` on the current route. */
export default function DateDropdown({ dateKey, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const selected = parseDateKey(dateKey);
  const label = format(selected, 'MMMM d, yyyy');

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
            className='origin-[var(--transform-origin)] rounded-lg border-2 border-pastel-stroke bg-white p-0 shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'
            initialFocus={false}
          >
            <Calendar
              mode='single'
              selected={selected}
              onSelect={(d) => {
                if (d) {
                  router.replace(`${pathname}?date=${formatDateKey(d)}`);
                }
                setOpen(false);
              }}
              className='rounded-lg border-0 bg-white'
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
