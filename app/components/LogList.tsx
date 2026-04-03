'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCallback, useRef, useState } from 'react';
import { deleteLog, editLogs } from '@/lib/logs';
import { formatTime12h } from '@/lib/date-utils';
import CategorySelect from '@/app/components/CategorySelect';
import Input from '@/app/components/Input';
import type { CategorySelectOption } from '@/lib/category-select-options';

export type DashboardLog = {
  id: string;
  ticketNumber: string;
  category: string;
  time: Date | string;
};

function toDate(value: Date | string) {
  return typeof value === 'string' ? new Date(value) : value;
}

function LogRow({
  log,
  categoryOptions,
}: {
  log: DashboardLog;
  categoryOptions: CategorySelectOption[];
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogEl, setDialogEl] = useState<HTMLDialogElement | null>(null);
  const setDialogNode = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    setDialogEl(node);
  }, []);
  const time = toDate(log.time);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    await editLogs(new FormData(form));
    dialogRef.current?.close();
  }

  async function handleDelete() {
    if (
      !confirm(
        'Delete this log? This cannot be undone.',
      )
    ) {
      return;
    }
    const fd = new FormData();
    fd.set('id', log.id);
    await deleteLog(fd);
    dialogRef.current?.close();
  }

  return (
    <li className='flex flex-wrap items-center gap-4 py-3'>
      <div className='flex flex-wrap justify-between items-center w-full rounded-lg'>
        <div className='space-x-4'>
          <span className='font-medium tabular-nums'>{formatTime12h(time)}</span>
          <span>{log.ticketNumber}</span>
          <span className='text-zinc-700'>{log.category}</span>
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='rounded-lg border-2 border-zinc-900 p-2 text-zinc-900 hover:bg-zinc-100'
            aria-label='Edit log'
            onClick={() => dialogRef.current?.showModal()}
          >
            <PencilSquareIcon className='size-5' aria-hidden />
          </button>
          <button
            type='button'
            className='rounded-lg border-2 border-red-800 p-2 text-red-800 hover:bg-red-100'
            aria-label='Delete log'
            onClick={handleDelete}
          >
            <TrashIcon className='size-5' aria-hidden />
          </button>
        </div>
      </div>

      <dialog
        ref={setDialogNode}
        className='min-h-[min(28rem,65vh)] w-full max-w-2xl overflow-visible rounded-xl border-2 border-zinc-900 bg-white p-8 shadow-xl backdrop:bg-black/40'
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 overflow-visible'
        >
          <h2 className='font-semibold'>Edit log</h2>
          <input type='hidden' name='id' value={log.id} />
          <Input
            label='Ticket number'
            name='ticketNumber'
            inputId={`edit-ticket-${log.id}`}
            defaultValue={log.ticketNumber}
            required
          />
          <CategorySelect
            key={`${log.id}-${log.category}`}
            name='category'
            defaultValue={log.category}
            options={categoryOptions}
            portalContainer={dialogEl}
          />
          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              className='rounded-lg border-2 px-4 py-2'
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-lg border-2 border-zinc-900 bg-zinc-900 px-4 py-2 text-white'
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </li>
  );
}

export default function LogList({
  logs,
  categoryOptions,
}: {
  logs: DashboardLog[];
  categoryOptions: CategorySelectOption[];
}) {
  return (
    <ul className='divide-y divide-gray-500 rounded-lg border-2 px-4'>
      {logs.map((log) => (
        <LogRow
          key={log.id}
          log={log}
          categoryOptions={categoryOptions}
        />
      ))}
    </ul>
  );
}
