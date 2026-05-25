import { useState } from "react";
import { DataPageShell } from "../../../components/page/data-page-shell";

export function RxUsersPage() {
  const [formState, setFormState] = useState<Record<string, unknown>>({});
  
    const updateField = (name: string, value: unknown) => {
      setFormState((current) => ({
        ...current,
        [name]: value,
      }))
      console.log({ formState })
    }
  
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
      buildCreatePayload={(values) => ({
        username: values.username,
        password: values.password,
        roleCodes: String(values.roleCodes ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })}
      canDelete
      formState={formState}
      setFormState={setFormState}
      updateField={updateField}
    />
  )
}