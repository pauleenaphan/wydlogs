export type CategorySelectOption = { value: string; label: string };

export const DEFAULT_CATEGORY_SELECT_OPTIONS: CategorySelectOption[] = [
  { value: "uncategorized", label: "Uncategorized" },
];

function labelForCategoryName(name: string): string {
  const preset = DEFAULT_CATEGORY_SELECT_OPTIONS.find((x) => x.value === name);
  return preset?.label ?? name;
}

/** Built-in options first, then DB-only names (sorted). */
export function mergeCategorySelectOptions(
  dbCategories: { name: string }[],
): CategorySelectOption[] {
  const defaults = [...DEFAULT_CATEGORY_SELECT_OPTIONS];
  const seen = new Set(defaults.map((d) => d.value));
  const extras = dbCategories
    .filter((c) => c.name.trim() !== "" && !seen.has(c.name))
    .map((c) => ({ value: c.name, label: labelForCategoryName(c.name) }))
    .sort((a, b) => a.value.localeCompare(b.value));
  return [...defaults, ...extras];
}
