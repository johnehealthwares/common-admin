import { DataPageShell } from "@/features/components/data-page-shell"
import { ColumnDataType, ColumnTypeFilters } from "@/features/rxsoft/types"
import { codingConceptEndpoint } from "@/lib/coding-concept-api"
import { codingModuleOptions } from "../shared"

const conceptsEndpoint = codingConceptEndpoint('/concepts')

const conceptFields = [
  {
    name: 'module',
    label: 'Module',
    type: 'select' as const,
    required: true,
    options: codingModuleOptions,
    placeholder: 'Select module',
  },
  {
    name: 'code',
    label: 'Code',
    required: true,
    placeholder: 'LOINC-12345',
  },
  {
    name: 'shortName',
    label: 'Short name',
    placeholder: 'CBC',
  },
  {
    name: 'longName',
    label: 'Long name',
    col: 12,
    placeholder: 'Complete Blood Count',
  },
  {
    name: 'shortDescription',
    label: 'Short description',
    col: 12,
    placeholder: 'Brief label used in compact views',
  },
  {
    name: 'fullDescription',
    label: 'Full description',
    col: 12,
    placeholder: 'Long clinical description',
  },
];

const columns = [
  { key: 'concept', label: 'Concept', filters: ColumnTypeFilters.STRING },
  { key: 'code', label: 'Code', filters: ColumnTypeFilters.STRING },
  { key: 'shortName', label: 'Short name', filters: ColumnTypeFilters.STRING },
  { key: 'longName', label: 'Long name', filters: ColumnTypeFilters.STRING },
  { key: 'updatedAt', label: 'Updated', dataType: ColumnDataType.DATE, filters: ColumnTypeFilters.DATE },
]


export const Concepts = ({formState}: {formState?: any}) => {

  return <DataPageShell
    embedded
    title='Concept Codes'
    description='Registered codes by coding module.'
    endpoint={conceptsEndpoint}
    columns={columns}
    modalTitle='Add Concept Code'
    createFields={conceptFields}
    formState={formState}
    buildCreatePayload={(values) => ({
      code: {
        module: values.module,
        code: values.code,
        shortName: values.shortName,
        fullName: values.fullName,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
      },
    })}
    buildUpdatePayload={(values) => ({
      module: values.module,
      code: values.code,
      shortName: values.shortName,
      fullName: values.fullName,
      shortDescription: values.shortDescription,
      fullDescription: values.fullDescription,
    })}
    canDelete
  />
}