import { DataPageShell } from "../../../components/data-page-shell";

export function RxRolesPage() {
  return (
    <DataPageShell
    
      title='Roles'
      description='Role and permission governance for enterprise RBAC control.'
      endpoint='/roles'
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        {
          key: 'permissionCodes',
          label: 'Permissions',
          render: (row) => ((row.permissionCodes as string[] | undefined) ?? []).join(', '),
        },
      ]}
      createFields={[
        { name: 'code', label: 'Code', required: true, placeholder: 'manager' },
        { name: 'name', label: 'Name', required: true, placeholder: 'Manager' },
        {
          name: 'permissionCodes',
          label: 'Permission Codes (comma-separated)',
          required: true,
          placeholder: 'products:read,inventory:read',
        },
      ]}
      sortOptions={[
        { value: 'code', label: 'Code' },
        { value: 'name', label: 'Name' },
      ]}
      buildCreatePayload={(values) => ({
        code: values.code,
        name: values.name,
        permissionCodes: String(values.permissionCodes ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })}
    />
  )
}