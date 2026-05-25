import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxPharmaceuticsPage() {
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
      title='Pharmaceutics'
      description='Clinical and pharmaceutical reference records.'
      endpoint='/pharmaceutics'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'commonGenericName', label: 'Generic Name' },
        { key: 'clinicalName', label: 'Clinical Name' },
        { key: 'drugClass', label: 'Drug Class' },
        { key: 'updatedAt', label: 'Updated' },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true },
        { name: 'commonBrandName', label: 'Common Brand Name' },
        { name: 'commonGenericName', label: 'Common Generic Name' },
        { name: 'clinicalName', label: 'Clinical Name' },
        { name: 'drugClass', label: 'Drug Class' },
        { name: 'chemicalConstituents', label: 'Chemical Constituents' },
        { name: 'pharmaceutics', label: 'Pharmaceutics' },
        { name: 'indications', label: 'Indications' },
        { name: 'contraindications', label: 'Contraindications' },
        { name: 'mechanism', label: 'Mechanism' },
        { name: 'missedDose', label: 'Missed Dose' },
        { name: 'drugInteractions', label: 'Drug Interactions' },
        { name: 'dosage', label: 'Dosage' },
      ]}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}