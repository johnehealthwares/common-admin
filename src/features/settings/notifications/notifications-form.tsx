import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'

import {
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  Radio,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'

import { showSubmittedData } from '@/lib/show-submitted-data'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: (iss) =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<
  typeof notificationsFormSchema
>

const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) =>
        showSubmittedData(data)
      )}
    >
      <Stack gap="xl">
        {/* Notification Type */}
        <Box>
          <Text fw={500} mb="sm">
            Notify me about...
          </Text>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Radio.Group
                value={field.value}
                onChange={field.onChange}
              >
                <Stack gap="xs">
                  <Radio
                    value="all"
                    label="All new messages"
                  />

                  <Radio
                    value="mentions"
                    label="Direct messages and mentions"
                  />

                  <Radio
                    value="none"
                    label="Nothing"
                  />
                </Stack>
              </Radio.Group>
            )}
          />

          {errors.type && (
            <Text c="red" size="sm" mt="xs">
              {errors.type.message}
            </Text>
          )}
        </Box>

        {/* Email Notifications */}
        <Box>
          <Title order={3} mb="md">
            Email Notifications
          </Title>

          <Stack gap="md">
            <Controller
              control={control}
              name="communication_emails"
              render={({ field }) => (
                <Paper withBorder p="md" radius="md">
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text fw={500}>
                        Communication emails
                      </Text>

                      <Text size="sm" c="dimmed">
                        Receive emails about your account
                        activity.
                      </Text>
                    </Box>

                    <Switch
                      checked={field.value}
                      onChange={(event) =>
                        field.onChange(
                          event.currentTarget.checked
                        )
                      }
                    />
                  </Group>
                </Paper>
              )}
            />

            <Controller
              control={control}
              name="marketing_emails"
              render={({ field }) => (
                <Paper withBorder p="md" radius="md">
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text fw={500}>
                        Marketing emails
                      </Text>

                      <Text size="sm" c="dimmed">
                        Receive emails about new products,
                        features, and more.
                      </Text>
                    </Box>

                    <Switch
                      checked={field.value}
                      onChange={(event) =>
                        field.onChange(
                          event.currentTarget.checked
                        )
                      }
                    />
                  </Group>
                </Paper>
              )}
            />

            <Controller
              control={control}
              name="social_emails"
              render={({ field }) => (
                <Paper withBorder p="md" radius="md">
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text fw={500}>Social emails</Text>

                      <Text size="sm" c="dimmed">
                        Receive emails for friend requests,
                        follows, and more.
                      </Text>
                    </Box>

                    <Switch
                      checked={field.value}
                      onChange={(event) =>
                        field.onChange(
                          event.currentTarget.checked
                        )
                      }
                    />
                  </Group>
                </Paper>
              )}
            />

            <Controller
              control={control}
              name="security_emails"
              render={({ field }) => (
                <Paper withBorder p="md" radius="md">
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text fw={500}>Security emails</Text>

                      <Text size="sm" c="dimmed">
                        Receive emails about your account
                        activity and security.
                      </Text>
                    </Box>

                    <Switch
                      checked={field.value}
                      disabled
                      readOnly
                    />
                  </Group>
                </Paper>
              )}
            />
          </Stack>
        </Box>

        {/* Mobile Settings */}
        <Box>
          <Checkbox
            label={
              <Box>
                <Text fw={500}>
                  Use different settings for my mobile
                  devices
                </Text>

                <Text size="sm" c="dimmed">
                  You can manage your mobile notifications
                  in the{' '}
                  <Link
                    to="/settings"
                    style={{
                      textDecoration: 'underline',
                    }}
                  >
                    mobile settings
                  </Link>{' '}
                  page.
                </Text>
              </Box>
            }
            {...register('mobile')}
          />
        </Box>

        <Button type="submit" w="fit-content">
          Update notifications
        </Button>
      </Stack>
    </Box>
  )
}