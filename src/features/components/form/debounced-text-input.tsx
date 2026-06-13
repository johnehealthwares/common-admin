import { TextInput, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '../utils';

type Props = {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  isTextarea?: boolean;
  [key: string]: any;
};

export function DebouncedTextInput({
  value,
  onChange,
  debounceMs = 300,
  isTextarea = false,
  ...props
}: Props) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebouncedValue(localValue, debounceMs);

  // Update local value when prop changes (from parent)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Call onChange only for debounced value
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  const Component = isTextarea ? Textarea : TextInput;

  return (
    <Component
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.currentTarget.value)}
    />
  );
}
