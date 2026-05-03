import { useMemo, useState } from 'react'
import { Plus, AlertCircle, CheckCircle, Server } from 'lucide-react'
import {
    Button,
    Modal,
    Stack,
    Group,
    Title,
    Tabs,
    Badge,
    Text,
} from '@mantine/core'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { JsonEditorField } from '@/features/components/json-editor-field'
import { DataTable } from '@/features/components/table/table'
import { RxPage } from '@/features/components/rx-page'
import { SelectField } from '@/features/components/form/select'
import { DebouncedInput } from '@/features/components/debounced-search'
import {
    AE_STATUS_OPTIONS,
    PROTOCOL_TYPE_OPTIONS,
    TLS_VERSION_OPTIONS,
    HTTP_METHOD_OPTIONS,
    AUTH_TYPE_OPTIONS,
    HL7_VERSION_OPTIONS,
    FHIR_VERSION_OPTIONS,
} from '../types/constants'
import {
    JsonPreviewDialog,
    LabelField,
    getDirtyPayload,
    normalizeRows,
    useCommunicationCrud,
    useCommunicationList,
    CommunicationRow,
} from './shared'
import { Column, FilterValue, TabGroup } from '@/features/rxsoft/types'
import { PaginatedDataTable } from '@/features/components/paginated-data-table'
import { GeneralTab } from './ae-tabs/general-tab'
import { InboundTab } from './ae-tabs/inbound-tab'
import { OutboundTab } from './ae-tabs/outbound-tab'
import { SecurityTab } from './ae-tabs/security-tab'
import { AttributesTab } from './ae-tabs/attributes-tab'
import { DataPageShell } from '@/features/components/data-page-shell'
import { generalFieldGroups } from './ae-tabs/tabs'

export type ProtocolConfig = {
    protocol: string
    host: string
    port: number
    timeout?: number
    retryCount?: number
    retryDelayMs?: number
    codec?: string
    hl7Config?: Record<string, any>
    fhirConfig?: Record<string, any>
    httpConfig?: Record<string, any>
}

export type SecuritySettings = {
    tlsEnabled: boolean
    tlsVersion?: string
    certificatePath?: string
    privateKeyPath?: string
    caPath?: string
    acceptSelfSigned?: boolean
}

export type AEFormState = {
    id?: string
    name: string
    description: string
    facilityCode: string
    facilityId: string
    facilityName: string
    customId: string
    organizationId: string
    status: string
    inboundCapabilities: string[]
    outboundCapabilities: string[]
    inboundConfig: ProtocolConfig[]
    outboundConfig: ProtocolConfig[]
    securitySettings: SecuritySettings
    attributes?: Record<string, unknown>
}

const defaultSecuritySettings: SecuritySettings = {
    tlsEnabled: true,
    tlsVersion: 'TLSv1.3',
    acceptSelfSigned: false,
}

const defaultFormState: AEFormState = {
    name: '',
    description: '',
    facilityCode: '',
    facilityId: '',
    facilityName: '',
    customId: '',
    organizationId: '',
    status: 'ACTIVE',
    inboundCapabilities: [],
    outboundCapabilities: [],
    inboundConfig: [],
    outboundConfig: [],
    securitySettings: defaultSecuritySettings,
}

const columns: Column[] = [
    {
        key: 'id', label: 'ID', render: (row) => (
            <Text size="sm" truncate>{String(row.id).substring(0, 8)}</Text>
        )
    },
    {
        key: 'name', label: 'Name', render: (row: any) => (
            <Text size="sm" fw={500}>{row.name}</Text>
        )
    },
    {
        key: 'facilityCode', label: 'Facility Code', render: (row: any) => (
            <Text size="sm">{row.facilityCode || '-'}</Text>
        )
    },
    {
        key: 'status', label: 'Status', render: (row) => {
            const status = String(row.status)
            const colors: Record<string, string> = {
                ACTIVE: 'green',
                INACTIVE: 'gray',
                MAINTENANCE: 'yellow',
                ERROR: 'red',
            }
            return <Badge color={colors[status] || 'blue'}>{status}</Badge>
        }
    },
    {
        key: 'inboundCapabilities', label: 'Inbound', render: (row) => {
            const caps = Array.isArray(row.inboundCapabilities)
                ? row.inboundCapabilities.slice(0, 2)
                : []
            return (
                <Group gap="xs">
                    {caps.map((cap) => (
                        <Badge size="sm" variant="light" key={cap}>{cap}</Badge>
                    ))}
                </Group>
            )
        }
    },
    {
        key: 'outboundCapabilities', label: 'Outbound', render: (row) => {
            const caps = Array.isArray(row.outboundCapabilities)
                ? row.outboundCapabilities.slice(0, 2)
                : []
            return (
                <Group gap="xs">
                    {caps.map((cap) => (
                        <Badge size="sm" variant="light" key={cap}>{cap}</Badge>
                    ))}
                </Group>
            )
        }
    },
    {
        key: 'createdAt', label: 'Created', render: (row) => (
            <Text size="sm">{row.createdAt
                ? new Date(String(row.createdAt)).toLocaleDateString()
                : '-'}</Text>
        )
    },
]

export function ApplicationEntitiesPage() {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<string | undefined>(undefined)
    const [protocol, setProtocol] = useState<string | undefined>(undefined)
    const [selectedRow, setSelectedRow] = useState<CommunicationRow | null>(null)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isJsonOpen, setIsJsonOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isTestOpen, setIsTestOpen] = useState(false)

    const [formState, setFormState] = useState<AEFormState>(defaultFormState)
    const [activeTab, setActiveTab] = useState<string | null>('general')

    const { data, isLoading } = useCommunicationList('v1/aes', search, {
        status,
        protocol,
    })

    const { createMutation, updateMutation, deleteMutation } =
        useCommunicationCrud('v1/aes')


    const aes = Array.isArray(data) ? data : []

    const rows = useMemo(() => normalizeRows(aes), [aes])

    const handleCreate = () => {
        setFormState(defaultFormState)
        setSelectedRow(null)
        setActiveTab('general')
        setIsCreateOpen(true)
    }

    const handleEdit = (row: CommunicationRow) => {
        setFormState({
            id: String(row.id),
            name: String(row.name || ''),
            description: String(row.description || ''),
            facilityCode: String(row.facilityCode || ''),
            facilityId: String(row.facilityId || ''),
            facilityName: String(row.facilityName || ''),
            customId: String(row.customId || ''),
            organizationId: String(row.organizationId || ''),
            status: String(row.status || 'ACTIVE'),
            inboundCapabilities: Array.isArray(row.inboundCapabilities)
                ? row.inboundCapabilities
                : [],
            outboundCapabilities: Array.isArray(row.outboundCapabilities)
                ? row.outboundCapabilities
                : [],
            inboundConfig: Array.isArray(row.inboundConfig)
                ? row.inboundConfig
                : [],
            outboundConfig: Array.isArray(row.outboundConfig)
                ? row.outboundConfig
                : [],
            securitySettings: (row.securitySettings as SecuritySettings) ||
                defaultSecuritySettings,
            attributes: row.attributes as Record<string, unknown>,
        })
        setSelectedRow(row)
        setActiveTab('general')
        setIsEditOpen(true)
    }

    const handleSave = async () => {
        if (!formState.name) {
            alert('AE name is required')
            return
        }

        if (
            !formState.inboundCapabilities.length &&
            !formState.outboundCapabilities.length
        ) {
            alert('At least one inbound or outbound capability is required')
            return
        }

        const payload = {
            ...formState,
        }
        delete payload.id

        if (formState.id) {
            await updateMutation.mutateAsync({
                id: formState.id,
                payload: getDirtyPayload(selectedRow || {}, payload),
            })
        } else {
            await createMutation.mutateAsync(payload)
        }

        setIsCreateOpen(false)
        setIsEditOpen(false)
    }


    const handleDelete = async () => {
        if (!selectedRow?.id) return
        await deleteMutation.mutateAsync(String(selectedRow.id))
        setIsDeleteOpen(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'green'
            case 'INACTIVE':
                return 'gray'
            case 'MAINTENANCE':
                return 'yellow'
            case 'ERROR':
                return 'red'
            default:
                return 'blue'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <CheckCircle size={14} />
            case 'ERROR':
                return <AlertCircle size={14} />
            default:
                return <Server size={14} />
        }
    }



    const tabGroups: TabGroup[] = [
        {
            value: 'general',
            title: 'General',
            render: ({ formState, updateField }) => (
                <GeneralTab
                    formState={formState}
                    setFormState={setFormState}
                    updateField={updateField}
                />
            ),
            fieldGroups: generalFieldGroups
        },
        {
            value: 'inbound',
            title: 'Inbound Config',
            render: ({ formState, updateField }) => (
                <InboundTab
                    formState={formState}
                    updateField={updateField}
                />
            ),
            fields: []
        },
        {
            value: 'outbound',
            title: 'Outbound Config',
            render: ({ formState, updateField }) => (
                <OutboundTab
                    formState={formState}
                    setFormState={setFormState}
                    updateField={updateField}
                />
            ),
        },
        {
            value: 'security',
            title: 'Security',
            render: ({ formState, updateField }) => (
                <SecurityTab
                    formState={formState}
                    setFormState={setFormState}
                    updateField={updateField}
                />
            ),
        },
        {
            value: 'attributes',
            title: 'Attributes',
            fields: [{
                label: 'Custom Attributes',
                name: 'attributes',
                type: 'json',
                defaultValue: formState.attributes,
            }],
            render: ({ formState, updateField }) => (
                <AttributesTab
                    formState={formState}
                    setFormState={setFormState}
                    updateField={updateField}
                    
                />
            ),
        },
    ]

    return (
       <DataPageShell
           embedded
           title='Application Entity'
           description='Registered codes by coding module.'
           endpoint='v1/aes'
           columns={columns}
           modalTitle='Application Enntity'
           tabGroups={tabGroups}
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
    )
}



//  <RxPage
//             title="Application Entities"
//             description="Manage healthcare system integrations and protocol configurations"
//             actions={
//                 <Button onClick={handleCreate} leftSection={<Plus size={16} />}>
//                     New AE
//                 </Button>
//             }
//         >
//             <Stack gap="md">
//                 <Group>
//                     <SelectField
//                         label="Filter by Status"
//                         options={AE_STATUS_OPTIONS}
//                         value={status || ''}
//                         onChange={(v) => setStatus(v || undefined)}

//                     />
//                     <SelectField
//                         label="Filter by Protocol"
//                         options={PROTOCOL_TYPE_OPTIONS}
//                         value={protocol || ''}
//                         onChange={(v) => setProtocol(v || undefined)}

//                     />
//                 </Group>

//                 <DataTable
//                     rows={rows}
//                     columns={columns}
//                     isLoading={isLoading}
//                     appliedFilters={{}}
//                     applyColumnFilter={ }
//                     errorLoading={false}
//                     searchValue={search}
//                     onSearchChange={setSearch}

//                 />
//             </Stack>

//             {/* CREATE/EDIT MODAL */}
//             <Modal
//                 opened={isCreateOpen || isEditOpen}
//                 onClose={() => {
//                     setIsCreateOpen(false)
//                     setIsEditOpen(false)
//                 }}
//                 title={
//                     <Title order={4}>
//                         {formState.id ? 'Edit Application Entity' : 'Create Application Entity'}
//                     </Title>
//                 }
//                 size="xl"
//             >
//                 <Tabs defaultValue="general" >
//                     <Tabs.List>
//                         {tabGroups?.map(tab => (
//                             <Tabs.Tab
//                                 key={tab.value}
//                                 value={tab.value}
//                                 disabled={!formState.id && tab.disableOnCreate}
//                             >
//                                 {tab.title}
//                             </Tabs.Tab>
//                         ))}
//                     </Tabs.List>

//                     {tabGroups?.map(tab => (
//                         <Tabs.Panel key={tab.value} value={tab.value}>
//                             {tab.render ? (
//                                 tab.render({ formState, updateField })
//                             ) : (
//                                 <GeneratedFields
//                                     fields={tab.fields}
//                                     fieldGroups={tab.fieldGroups}
//                                     values={formState}
//                                     onChange={updateField}
//                                 />
//                             )}

//                             <Group justify="space-between" mt="md">
//                                 <Button variant="default" onClick={closeModal}>
//                                     Cancel
//                                 </Button>

//                                 <Button
//                                     loading={isSubmitting}
//                                     onClick={() => handleSubmit(tab.value)}
//                                 >
//                                     {formState.id ? 'Save' : 'Create'}
//                                 </Button>
//                             </Group>
//                         </Tabs.Panel>
//                     ))}


//                     {/* GENERAL TAB */}
//                     <Tabs.Panel value="general">
//                         <GeneralTab
//                             formState={formState}
//                             setFormState={setFormState}
//                             onSave={handleSave}
//                             onCancel={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
//                             isLoading={createMutation.isPending || updateMutation.isPending}
//                         />
//                     </Tabs.Panel>

//                     {/* INBOUND CONFIG TAB */}
//                     <Tabs.Panel value="inbound">
//                         <InboundTab
//                             formState={formState}
//                             setFormState={setFormState}
//                             onSave={handleSave}
//                             onCancel={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
//                             isLoading={createMutation.isPending || updateMutation.isPending}
//                         />
//                     </Tabs.Panel>

//                     {/* OUTBOUND CONFIG TAB */}
//                     <Tabs.Panel value="outbound">
//                         <OutboundTab
//                             formState={formState}
//                             setFormState={setFormState}
//                             onSave={handleSave}
//                             onCancel={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
//                             isLoading={createMutation.isPending || updateMutation.isPending}
//                         />
//                     </Tabs.Panel>

//                     {/* SECURITY TAB */}
//                     <Tabs.Panel value="security">
//                         <SecurityTab
//                             formState={formState}
//                             setFormState={setFormState}
//                             onSave={handleSave}
//                             onCancel={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
//                             isLoading={createMutation.isPending || updateMutation.isPending}
//                         />
//                     </Tabs.Panel>

//                     {/* ATTRIBUTES TAB */}
//                     <Tabs.Panel value="attributes">
//                         <AttributesTab
//                             formState={formState}
//                             setFormState={setFormState}
//                             onSave={handleSave}
//                             onCancel={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
//                             isLoading={createMutation.isPending || updateMutation.isPending}
//                         />
//                     </Tabs.Panel>
//                 </Tabs>
//             </Modal>

            
//         </RxPage>

    // const handleSubmit = async (tabValue: string) => {
    //     if (!formState.id) {
    //         // CREATE FLOW
    //         const payload =
    //             createMode === 'single-tab'
    //                 ? buildCreatePayload(pickFieldsForTab(tabValue, formState))
    //                 : buildCreatePayload(formState)

    //         const created = await createMutation.mutateAsync(payload)

    //         // switch to edit mode
    //         setFormState(created)

    //         // optional: jump to next tab
    //         if (createMode === 'single-tab') {
    //             goToNextTab(tabValue)
    //         }

    //         return
    //     }

    //     // UPDATE FLOW (per tab)
    //     const payload = buildUpdatePayload(
    //         pickFieldsForTab(tabValue, formState),
    //         formState
    //     )

    //     await updateMutation.mutateAsync(payload)
    // }