/**
 * Compact UI utility classes for enterprise data-dense grids and operator consoles.
 * Optimized for power-user workflows with minimal padding and keyboard-first UX.
 */

export const compactUI = {
  /* Tight spacing constants */
  spacing: {
    xs: '0.125rem', // 2px
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '1rem', // 16px
  },

  /* Table & Grid styles */
  table: {
    container: 'border border-border rounded-sm',
    row: 'h-[28px] hover:bg-accent/50 data-[selected]:bg-accent',
    cell: 'px-3 py-1 text-xs leading-tight align-middle truncate',
    header:
      'h-7 px-3 py-1 bg-muted/50 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground',
    checkbox: 'size-4 max-sm:size-3.5',
  },

  /* Form & input styles */
  form: {
    container: 'grid gap-2',
    group: 'flex flex-col gap-1.5',
    label: 'text-xs font-medium leading-none',
    description: 'text-[11px] text-muted-foreground',
  },

  /* Input, button, select sizing */
  control: {
    small: 'h-7 px-2.5 text-xs rounded-sm',
    compact: 'h-8 px-3 text-sm rounded-md',
    regular: 'h-9 px-4 text-sm rounded-md',
  },

  /* Multi-pane layout */
  pane: {
    container: 'flex h-full gap-1 overflow-hidden',
    side: 'flex-col border-r border-border bg-muted/30 overflow-y-auto',
    main: 'flex-1 flex flex-col overflow-hidden',
  },

  /* Inspector/detail panel */
  inspector: {
    container: 'flex flex-col gap-2 overflow-y-auto p-2',
    section: 'border-t border-border pt-2 first:border-t-0 first:pt-0',
    title: 'text-[11px] font-semibold uppercase tracking-widest text-muted-foreground',
    field: 'grid gap-1',
  },

  /* Badge & status indicators (compact) */
  badge: 'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium',
};

export const compactClasses = {
  /* Data table */
  dataTable: `${compactUI.table.container} text-xs`,
  dataTableRow: compactUI.table.row,
  dataTableCell: compactUI.table.cell,
  dataTableHeader: compactUI.table.header,

  /* Sidebar for lists */
  sidebar: `${compactUI.pane.side} w-48`,
  sidebarItem: 'px-2 py-1.5 text-xs hover:bg-accent focus-visible:bg-accent cursor-pointer',

  /* Inspector panel */
  inspector: compactUI.inspector.container,

  /* Keyboard hint */
  shortcutHint: 'text-[10px] font-mono text-muted-foreground/60 tracking-wide',
};
