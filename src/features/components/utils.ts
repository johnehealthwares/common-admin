import { useEffect, useState } from 'react';
import { SearchOption } from '../rxsoft/types';

export function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export function getArrayPayload(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === 'object') {
    const shaped = payload as Record<string, unknown>;
    if (Array.isArray(shaped.data)) return shaped.data as Record<string, unknown>[];
    if (Array.isArray(shaped.items)) return shaped.items as Record<string, unknown>[];
    if (Array.isArray(shaped.results)) return shaped.results as Record<string, unknown>[];
  }
  return [];
}

export function mapOption(item: unknown, valueKey?: string, labelKey?: string): SearchOption {
  if (typeof item !== 'object') {
    const primitive = String(item);
    return { value: primitive, label: primitive };
  }

  const source = item as Record<string, unknown>;
  const rawValue =
    (valueKey ? source[valueKey] : undefined) ??
    source.id ??
    source.value ??
    source.code ??
    source.name;

  const value = String(rawValue);
  const label = String(
    (labelKey ? source[labelKey] : undefined) ??
      source.name ??
      source.label ??
      source.code ??
      rawValue
  );
  return { value, label };
}
