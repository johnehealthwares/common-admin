import { DataPageShell } from "@/features/components/data-page-shell"
import { codingConceptEndpoint } from "@/lib/coding-concept-api"
import { codingModuleOptions } from "../shared"
import { ColumnTypeFilters } from "@/features/rxsoft/types"

const conceptsEndpoint = codingConceptEndpoint('/concepts')
const valuesEndpoint = codingConceptEndpoint('/concepts/values')



export const Values = () => {
    return (<DataPageShell
        embedded
        title='Concept Values'
        description='EAV metadata attached to module codes.'
        endpoint={valuesEndpoint}
        columns={[
            { key: 'concept', label: 'Module' },
            { key: 'conceptCode.code', label: 'Type', render: (row: any) => row.conceptCode.code,  filters: ColumnTypeFilters.STRING },
            { key: 'conceptCode.longName', label: 'Concept Name', render: (row: any) => row.conceptCode.longName,  filters: ColumnTypeFilters.STRING  },
            { key: 'attribute.name', label: 'Attribute name', render: (row: any) => row.attribute.name,  filters: ColumnTypeFilters.STRING  },
            { key: 'value', label: 'Value' },
            { key: 'valueFormat', label: 'Format' },
            { key: 'description', label: 'Description' },
        ]}
        modalTitle='Add Concept Value'
        createFields={[
            {
                name: 'entity',
                label: 'Concept',
                type: 'async-select',
                required: true,
                endpoint: conceptsEndpoint,
                searchParam: 'search',
                valueKey: 'id',
                labelKey: 'shortName',
                placeholder: 'Search concept by code or name',
            },
            {
                name: 'module',
                label: 'Module',
                type: 'select',
                required: true,
                options: codingModuleOptions,
                placeholder: 'Select module',
            },
            {
                name: 'attributeId',
                label: 'Attribute ID',
                required: true,
            },
            {
                name: 'attributeName',
                label: 'Attribute name',
                required: true,
            },
            {
                name: 'value',
                label: 'Attribute value',
                required: true,
                col: 12,
            },
            {
                name: 'valueFormat',
                label: 'Value format',
                placeholder: 'text | json | number',
            },
        ]}
        buildCreatePayload={(values) => ({
            entity: values.entity,
            module: values.module,
            attributeId: values.attributeId,
            attributeName: values.attributeName,
            value: values.value,
            valueFormat: values.valueFormat,
        })}
        buildUpdatePayload={(values) => ({
            entity: values.entity,
            module: values.module,
            attributeId: values.attributeId,
            attributeName: values.attributeName,
            value: values.value,
            valueFormat: values.valueFormat,
        })}
        canDelete
    />)
}