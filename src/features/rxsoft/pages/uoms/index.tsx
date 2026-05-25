import { DataPageShell } from "../../../components/page/data-page-shell";
import { FormProvider } from "@/features/components/form/form-context";
import { UOM_COLUMNS, UOM_CREATE_FIELDS, buildCreatePayload, buildFormState, type UomListState } from './schema';
import { useState } from "react";

export function RxUomsPage() {
   const [formState, setFormState] = useState<Record<string, unknown>>({});
  
    // const updateField = (name: string, value: unknown, i?: number) => {
    //   setFormState((current) => ({
    //     ...current,
    //     [name]: value,
    //   }))
    // }
  
  
  return (
    <FormProvider<UomListState>
      initialState={{}}
    >
      <DataPageShell
        title='UOMs'
        description='Manage units of measure.'
        endpoint='/uoms'
        columns={UOM_COLUMNS}
        createFields={UOM_CREATE_FIELDS.fields}
        buildCreatePayload={(values) => buildCreatePayload(values as UomListState)}
        buildUpdatePayload={(values) => buildCreatePayload(values as UomListState)}
        buildFormState={buildFormState}
        canDelete
        detailPathBuilder={(row) => `/uoms/${String(row.id)}`}
        // updateField={updateField}
      />
    </FormProvider>
  )
}

export { RxUomEditPage } from './create'
export { RxUomDetailsPage } from './detail'
