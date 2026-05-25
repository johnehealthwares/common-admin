import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxJournalsPage() {
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
      title='Journals'
      description='Accounting journals for sales, purchases, cash, banks and general entries.'
      endpoint='/journals'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'journalType', label: 'Type' },
        { key: 'isActive', label: 'Active' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'journalType', label: 'Journal Type', required: true, placeholder: 'general' },
        { name: 'defaultDebitAccountId', label: 'Default Debit Account ID' },
        { name: 'defaultCreditAccountId', label: 'Default Credit Account ID' },
        { name: 'isActive', label: 'Active', type: 'switch', defaultValue: true },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}