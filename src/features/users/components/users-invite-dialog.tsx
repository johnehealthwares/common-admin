'use client'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus, Send } from 'lucide-react'

import {
  Modal,
  TextInput,
  Textarea,
  Stack,
  Text,
  Select,
  Group,
  Button,
} from '@mantine/core'

import { roles } from '../data/data'
import { showSubmittedData } from '@/lib/show-submitted-data'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Please enter an email to invite.' : undefined,
  }),
  role: z.string().min(1, 'Role is required.'),
  desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: Props) {
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: '',
      desc: '',
    },
  })

  const onSubmit = (values: UserInviteForm) => {
    showSubmittedData(values)
    form.reset()
    onOpenChange(false)
  }

  const errors = form.formState.errors

  return (
    <Modal
      opened={open}
      onClose={() => {
        form.reset()
        onOpenChange(false)
      }}
      title={
        <Group gap="xs">
          <MailPlus size={18} />
          <Text fw={600}>Invite User</Text>
        </Group>
      }
      size="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Invite a new user by email and assign a role.
          </Text>

          {/* Email */}
          <TextInput
            label="Email"
            placeholder="john.doe@gmail.com"
            type="email"
            {...form.register('email')}
            error={errors.email?.message}
          />

          {/* Role (Controller required) */}
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
                error={errors.role?.message}
              />
            )}
          />

          {/* Description */}
          <Textarea
            label="Description (optional)"
            placeholder="Add a note to the invitation"
            autosize
            minRows={3}
            {...form.register('desc')}
            error={errors.desc?.message}
          />

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              type="submit"
              rightSection={<Send size={16} />}
              loading={form.formState.isSubmitting}
            >
              Invite
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}