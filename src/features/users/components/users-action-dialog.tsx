'use client'

import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Text,
  Select,
  Group,
} from '@mantine/core'

import { roles } from '../data/data'
import { type User } from '../data/schema'
import { showSubmittedData } from '@/lib/show-submitted-data'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.string().email('Invalid email'),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    { message: 'Password is required.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    { message: 'Password must be at least 8 characters long.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    { message: 'Password must contain at least one lowercase letter.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    { message: 'Password must contain at least one number.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    { message: "Passwords don't match.", path: ['confirmPassword'] }
  )

type UserForm = z.infer<typeof formSchema>

type Props = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { ...currentRow, password: '', confirmPassword: '', isEdit }
      : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isEdit,
      },
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Modal
      opened={open}
      onClose={() => {
        form.reset()
        onOpenChange(false)
      }}
      title={isEdit ? 'Edit User' : 'Add New User'}
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {isEdit ? 'Update the user here.' : 'Create new user here.'}
        </Text>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput label="First Name" {...form.register('firstName')} error={form.formState.errors.firstName?.message} />

            <TextInput label="Last Name" {...form.register('lastName')} error={form.formState.errors.lastName?.message} />

            <TextInput label="Username" {...form.register('username')} error={form.formState.errors.username?.message} />

            <TextInput label="Email" {...form.register('email')} error={form.formState.errors.email?.message} />

            <TextInput label="Phone Number" {...form.register('phoneNumber')} error={form.formState.errors.phoneNumber?.message} />

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select
                  label="Role"
                  placeholder="Select a role"
                  data={roles.map((r) => ({
                    label: r.label,
                    value: r.value,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.role?.message}
                />
              )}
            />

            <PasswordInput
              label="Password"
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />

            <PasswordInput
              label="Confirm Password"
              disabled={!isPasswordTouched}
              {...form.register('confirmPassword')}
              error={form.formState.errors.confirmPassword?.message}
            />
          </Stack>

          <Group justify="flex-end" mt="lg">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={form.formState.isSubmitting}>
              {isEdit ? 'Save changes' : 'Add User'}
            </Button>
          </Group>
        </form>
      </Stack>
    </Modal>
  )
}
