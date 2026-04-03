'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { deleteCategory, updateCategory } from '@/lib/category';

export type CategoryRow = {
  id: string;
  name: string;
  hours: number;
};

function CategoryRowEditor({
  category,
  onCancel,
  onSaved,
}: {
  category: CategoryRow;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    const result = await updateCategory(category.id, trimmed);
    setSaving(false);
    if (!result) {
      window.alert(
        'Could not update category. The name may already exist or is invalid.',
      );
      return;
    }
    onSaved();
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <input
        id={`edit-cat-${category.id}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='min-w-0 flex-1 rounded-lg border-2 border-zinc-900 px-2 py-1'
        disabled={saving}
      />
      <button
        type='button'
        className='rounded-lg border-2 border-zinc-900 px-2 py-1 disabled:opacity-50'
        disabled={saving}
        onClick={handleSave}
      >
        Save
      </button>
      <button
        type='button'
        className='rounded-lg border-2 px-2 py-1'
        disabled={saving}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

export default function ManageCategoriesModal({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function handleDelete(id: string, label: string) {
    if (
      !confirm(
        `Delete category '${label}'? Logs that used this name keep their label; only the category row is removed.`,
      )
    ) {
      return;
    }
    setDeletingId(id);
    const ok = await deleteCategory(id);
    setDeletingId(null);
    if (!ok) {
      window.alert('Could not delete category.');
      return;
    }
    refresh();
  }

  return (
    <>
      <button
        type='button'
        className='rounded-lg border-2 border-zinc-900 px-6 py-2'
        onClick={() => dialogRef.current?.showModal()}
      >
        Manage categories
      </button>

      <dialog
        ref={dialogRef}
        className='min-h-[min(24rem,58vh)] w-full max-w-2xl rounded-xl border-2 border-zinc-900 bg-white p-8 shadow-xl backdrop:bg-black/40'
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='font-semibold'>Your categories</h2>
            <button
              type='button'
              className='rounded-lg border-2 px-3 py-1'
              onClick={() => {
                setEditingId(null);
                dialogRef.current?.close();
              }}
            >
              Close
            </button>
          </div>

          {categories.length === 0 ? (
            <p className='text-zinc-600'>
              No saved categories yet. They show up here after you log with a
              category.
            </p>
          ) : (
            <ul className='divide-y divide-zinc-200 rounded-lg border border-zinc-200'>
              {categories.map((c) => (
                <li
                  key={c.id}
                  className='flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between'
                >
                  {editingId === c.id ? (
                    <CategoryRowEditor
                      category={c}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => {
                        setEditingId(null);
                        refresh();
                      }}
                    />
                  ) : (
                    <>
                      <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                        <span className='font-medium'>{c.name}</span>
                        <span className='tabular-nums text-zinc-600'>
                          {c.hours} {c.hours === 1 ? 'hour' : 'hours'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded-lg border-2 border-zinc-900 p-2 text-zinc-900 hover:bg-zinc-100'
                          aria-label={`Edit category ${c.name}`}
                          onClick={() => setEditingId(c.id)}
                          disabled={deletingId === c.id}
                        >
                          <PencilSquareIcon className='size-5' aria-hidden />
                        </button>
                        <button
                          type='button'
                          className='rounded-lg border-2 border-red-800 p-2 text-red-800 hover:bg-red-100 disabled:opacity-50'
                          aria-label={`Delete category ${c.name}`}
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id, c.name)}
                        >
                          <TrashIcon className='size-5' aria-hidden />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
