"use client";

import { useState } from "react";
import * as Select from "@radix-ui/react-select";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "uncategorized", label: "Uncategorized" },
  { value: "blank-1", label: "(blank 1)" },
  { value: "blank-2", label: "(blank 2)" },
  { value: "blank-3", label: "(blank 3)" },
];

type Props = {
  name: string;
  defaultValue?: string;
};

function resolveCategoryValue(raw: string) {
  return CATEGORIES.find((c) => c.value === raw)?.value ?? CATEGORIES[0].value;
}

export default function CategorySelect({ name, defaultValue = "" }: Props) {
  const [value, setValue] = useState(() =>
    resolveCategoryValue(defaultValue || CATEGORIES[0].value),
  );

  return (
    <div>
      <span>Category</span>
      <input type="hidden" name={name} value={value} readOnly />
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger aria-label="Category">
          <Select.Value placeholder="Select category" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper">
            <Select.Viewport>
              {CATEGORIES.map((c) => (
                <Select.Item key={c.value} value={c.value}>
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
