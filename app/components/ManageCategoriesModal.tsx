'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { createCategory, deleteCategory, updateCategory } from '@/lib/category';

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
    <div className='flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center'>
      <input
        id={`edit-cat-${category.id}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='min-h-11 w-full min-w-0 flex-1 rounded-lg border-2 border-pastel-stroke bg-card px-3 py-2 text-pastel-ink transition-colors hover:border-pastel-lilac-hover focus-visible:border-pastel-lilac-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-lilac/35'
        disabled={saving}
      />
      <div className='flex shrink-0 flex-wrap gap-2'>
        <button
          type='button'
          className='rounded-lg border-2 border-pastel-stroke bg-pastel-pink px-3 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-pink-hover disabled:opacity-50'
          disabled={saving}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type='button'
          className='rounded-lg border-2 border-pastel-stroke/50 bg-card px-3 py-2 text-pastel-ink transition-colors hover:bg-pastel-surface-hover'
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AddCategoryForm({
  onAdded,
  disabled,
}: {
  onAdded: () => void;
  disabled?: boolean;
}) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    const result = await createCategory(trimmed);
    setSaving(false);
    if (!result) {
      window.alert(
        'Could not add category. The name may already exist or is invalid.',
      );
      return;
    }
    setName('');
    onAdded();
  }

  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center'>
      <label className='sr-only' htmlFor='new-category-name'>
        New category name
      </label>
      <input
        id='new-category-name'
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void handleAdd();
          }
        }}
        placeholder='New category name'
        className='min-w-0 flex-1 rounded-lg border-2 border-pastel-stroke bg-card px-3 py-2 text-pastel-ink transition-colors placeholder:text-pastel-ink/40 hover:border-pastel-lilac-hover focus-visible:border-pastel-lilac-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-lilac/35 sm:min-w-48'
        disabled={saving || disabled}
        autoComplete='off'
      />
      <button
        type='button'
        className='rounded-lg border-2 border-pastel-stroke bg-pastel-lilac px-4 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-lilac-hover disabled:opacity-50'
        disabled={saving || disabled || !name.trim()}
        onClick={() => void handleAdd()}
      >
        Add category
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
        className='rounded-lg border-2 border-pastel-stroke bg-pastel-lilac px-6 py-2 font-medium text-pastel-ink transition-colors hover:bg-pastel-lilac-hover'
        onClick={() => dialogRef.current?.showModal()}
      >
        Manage categories
      </button>

      <dialog
        ref={dialogRef}
        className='min-h-[min(24rem,58vh)] w-full max-w-2xl rounded-xl border-2 border-pastel-stroke bg-card p-8 shadow-xl backdrop:bg-black/40'
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='font-semibold text-2xl'>Your categories</h2>
            <button
              type='button'
              className='rounded-lg border-2 border-pastel-stroke/50 bg-card px-3 py-1 text-pastel-ink transition-colors hover:bg-pastel-surface-hover'
              onClick={() => {
                setEditingId(null);
                dialogRef.current?.close();
              }}
            >
              Close
            </button>
          </div>

          <AddCategoryForm
            onAdded={refresh}
            disabled={editingId !== null}
          />

          <p className='text-sm text-pastel-ink/70'>
            Names you add here show up in the category dropdown when you log.
          </p>

          {categories.length === 0 ? (
            <p className='text-pastel-ink/70'>
              No rows yet—add your first category above.
            </p>
          ) : (
            <ul className='panel-surface-nested'>
              {categories.map((c) => (
                <li
                  key={c.id}
                  className={
                    editingId === c.id
                      ? 'min-w-0 px-3 py-2.5'
                      : 'flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between'
                  }
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
                        <span className='tabular-nums text-pastel-ink/70'>
                          {c.hours} {c.hours === 1 ? 'hour' : 'hours'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          className='rounded-lg border-2 border-pastel-stroke p-2 text-pastel-ink transition-colors hover:bg-pastel-surface-hover'
                          aria-label={`Edit category ${c.name}`}
                          onClick={() => setEditingId(c.id)}
                          disabled={deletingId === c.id}
                        >
                          <PencilSquareIcon className='size-5' aria-hidden />
                        </button>
                        <button
                          type='button'
                          className='rounded-lg border-2 border-pastel-danger bg-pastel-danger-soft p-2 text-pastel-danger-ink transition-colors hover:bg-pastel-danger-hover disabled:opacity-50'
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
