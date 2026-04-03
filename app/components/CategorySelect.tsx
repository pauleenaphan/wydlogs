'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import {
  DEFAULT_CATEGORY_SELECT_OPTIONS,
  type CategorySelectOption,
} from '@/lib/category-select-options';

type Props = {
  name: string;
  defaultValue?: string;
  /** Merged built-in + DB categories from the server. */
  options?: CategorySelectOption[];
  /**
   * Render the menu inside this node (e.g. the open `<dialog>`).
   * Required when used inside `showModal()` dialogs — body portals sit below the dialog top layer.
   */
  portalContainer?: HTMLElement | null;
};

function resolveCategoryValue(raw: string, list: CategorySelectOption[]) {
  return list.find((c) => c.value === raw)?.value ?? list[0]?.value ?? '';
}

export default function CategorySelect({
  name,
  defaultValue = '',
  options: optionsProp,
  portalContainer,
}: Props) {
  const options = optionsProp ?? DEFAULT_CATEGORY_SELECT_OPTIONS;
  const optionsKey = useMemo(
    () => options.map((o) => o.value).join('\0'),
    [options],
  );

  const resolvedValue = useMemo(
    () =>
      resolveCategoryValue(defaultValue || options[0]?.value || '', options),
    [defaultValue, options],
  );

  const [prevSync, setPrevSync] = useState({ defaultValue, optionsKey });
  const [value, setValue] = useState(() =>
    resolveCategoryValue(defaultValue || options[0]?.value || '', options),
  );

  if (
    prevSync.defaultValue !== defaultValue ||
    prevSync.optionsKey !== optionsKey
  ) {
    setPrevSync({ defaultValue, optionsKey });
    setValue(resolvedValue);
  }

  const inModal = portalContainer != null;

  return (
    <div className='relative z-10 flex w-full flex-col gap-2'>
      <span>Category</span>
      <input type='hidden' name={name} value={value} readOnly />
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger
          aria-label='Category'
          className='group flex w-full min-h-11 items-center justify-between gap-2 rounded-lg border-2 border-zinc-900 bg-white px-3 py-2 text-left'
        >
          <Select.Value placeholder='Select category' />
          <ChevronDownIcon
            className='size-5 shrink-0 text-zinc-700 transition-transform duration-200 group-data-[state=open]:rotate-180'
            aria-hidden
          />
        </Select.Trigger>
        <Select.Portal container={portalContainer ?? undefined}>
          <Select.Content
            position='popper'
            side='bottom'
            sideOffset={6}
            align='start'
            avoidCollisions={!inModal}
            collisionPadding={inModal ? 0 : 16}
            className='z-200 max-h-36 min-w-(--radix-select-trigger-width) overflow-y-auto overflow-x-hidden rounded-lg border-2 border-zinc-900 bg-white shadow-lg'
          >
            <Select.Viewport className='p-1'>
              {options.map((c) => (
                <Select.Item
                  key={c.value}
                  value={c.value}
                  className='relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-8 outline-none data-disabled:pointer-events-none data-highlighted:bg-pink-200 data-[state=checked]:font-semibold'
                >
                  <Select.ItemText>{c.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
