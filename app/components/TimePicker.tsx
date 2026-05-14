'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import * as Select from '@radix-ui/react-select';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const triggerClass =
  'group flex min-h-11 items-center justify-between gap-1 rounded-lg border-2 border-pastel-stroke bg-card px-3 py-2 text-sm text-pastel-ink transition-colors hover:bg-pastel-surface-hover';

const contentClass =
  'z-200 max-h-48 overflow-y-auto overflow-x-hidden rounded-lg border-2 border-pastel-stroke bg-card shadow-lg';

const itemClass =
  'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-6 text-pastel-ink outline-none transition-colors data-disabled:pointer-events-none data-highlighted:bg-pastel-surface-hover data-[state=checked]:font-semibold';

function TimeSelect({
  value,
  onValueChange,
  options,
  ariaLabel,
  portalContainer,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  portalContainer?: HTMLElement | null;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger aria-label={ariaLabel} className={triggerClass}>
        <Select.Value />
        <ChevronDownIcon
          className='size-4 shrink-0 text-pastel-ink/70 transition-transform duration-200 group-data-[state=open]:rotate-180'
          aria-hidden
        />
      </Select.Trigger>
      <Select.Portal container={portalContainer ?? undefined}>
        <Select.Content
          position='popper'
          side='bottom'
          sideOffset={6}
          align='center'
          className={contentClass}
        >
          <Select.Viewport className='p-1'>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} className={itemClass}>
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

type Props = {
  /** `HH:mm` in 24h format */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  portalContainer?: HTMLElement | null;
};

export default function TimePicker({ value, onChange, id, portalContainer }: Props) {
  const [h24, rawMin] = value.split(':').map(Number);
  const hour12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const minute = rawMin ?? 0;
  const period = h24 >= 12 ? 'PM' : 'AM';

  function update(newHour12: number, newMinute: number, newPeriod: string) {
    let h = newHour12;
    if (newPeriod === 'AM') {
      h = newHour12 === 12 ? 0 : newHour12;
    } else {
      h = newHour12 === 12 ? 12 : newHour12 + 12;
    }
    onChange(`${String(h).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`);
  }

  const hourOptions = HOURS_12.map((h) => ({
    value: String(h),
    label: String(h),
  }));

  const minuteOptions = MINUTES.map((m) => ({
    value: String(m),
    label: String(m).padStart(2, '0'),
  }));

  const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  return (
    <div className='flex items-center gap-2' id={id}>
      <TimeSelect
        value={String(hour12)}
        onValueChange={(v) => update(Number(v), minute, period)}
        options={hourOptions}
        ariaLabel='Hour'
        portalContainer={portalContainer}
      />
      <span className='text-pastel-ink font-medium'>:</span>
      <TimeSelect
        value={String(minute)}
        onValueChange={(v) => update(hour12, Number(v), period)}
        options={minuteOptions}
        ariaLabel='Minute'
        portalContainer={portalContainer}
      />
      <TimeSelect
        value={period}
        onValueChange={(v) => update(hour12, minute, v)}
        options={periodOptions}
        ariaLabel='AM/PM'
        portalContainer={portalContainer}
      />
    </div>
  );
}
