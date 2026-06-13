import type { ModuleId } from '@/features/shared/module-data';

/**
 * Shared types across all modules.
 */
export type SharedLayoutProps = {
  children?: React.ReactNode;
};

export type ModuleAwareProps = {
  module?: ModuleId;
};

export type DataTableColumn<T> = {
  id: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};
