import { DataPageShell } from "../../../components/data-page-shell";

export function RxUsersPage() {
  return (
    <DataPageShell
      title='Users'
      description='User lifecycle management, activation, assignment and traceability.'
      endpoint='/users'
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' },
        {
          key: 'roles',
          label: 'Roles',
          render: (row) => JSON.stringify(row.roles ?? []),
        },
      ]}
      createFields={[
        { name: 'username', label: 'Username', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        {
          name: 'roleCodes',
          label: 'Role Codes (comma-separated)',
          required: true,
          placeholder: 'admin,manager',
        },
      ]}
      sortOptions={[
        { value: 'createdAt', label: 'Created' },
        { value: 'updatedAt', label: 'Updated' },
        { value: 'username', label: 'Username' },
      ]}
      buildCreatePayload={(values) => ({
        username: values.username,
        password: values.password,
        roleCodes: String(values.roleCodes ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })}
    />
  )
}