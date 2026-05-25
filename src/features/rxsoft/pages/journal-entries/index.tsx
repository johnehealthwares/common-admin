import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxJournalEntriesPage() {
   const [formState, setFormState] = useState<Record<string, unknown>>({});
      const updateField = (name: string, value: unknown) => {
        setFormState((current: any) => ({
          ...current,
          [name]: value,
        }))
        console.log({ formState })
      }
      
  return (
    <DataPageShell
      title='Journal Entries'
      description='Header-level accounting postings.'
      endpoint='/journal-entries'
      columns={[
        { key: 'entryNumber', label: 'Entry Number' },
        { key: 'journalId', label: 'Journal' },
        { key: 'entryDate', label: 'Entry Date' },
        { key: 'status', label: 'Status' },
        {
          key: 'lines',
          label: 'Lines',
          render: (row) => String(((row.lines as unknown[]) ?? []).length),
        },
      ]}
      createFields={[
        { name: 'journalId', label: 'Journal ID', required: true },
        { name: 'entryNumber', label: 'Entry Number', required: true },
        { name: 'entryDate', label: 'Entry Date', required: true, placeholder: '2026-04-02' },
        { name: 'reference', label: 'Reference' },
        { name: 'sourceType', label: 'Source Type' },
        { name: 'sourceId', label: 'Source ID' },
        { name: 'status', label: 'Status', placeholder: 'draft' },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}