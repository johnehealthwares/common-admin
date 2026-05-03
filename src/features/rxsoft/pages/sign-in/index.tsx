import {
  Button,
  Card,
  Text,
  TextInput,
  PasswordInput,
  Badge,
  Group,
  Stack,
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { AuthLayout } from '@/features/auth/auth-layout'
import { useModuleStore } from '@/stores/module-store'
import { getModuleRoot } from '@/features/shared/module-data'
import { ModuleSelector } from '@/features/shared/module-selector'
import { useAuthStore } from '@/stores/auth-store'
import { Link } from '@tanstack/react-router'

const signInSchema = z.object({
  username: z.string().min(1, 'Please enter your username'),
  password: z.string().min(1, 'Please enter your password'),
})

type SignInValues = z.infer<typeof signInSchema>

export function RxSignIn({ redirectTo }: { redirectTo?: string }) {
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const selectedModule = useModuleStore((state) => state.selectedModule)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: 'admin',
      password: 'test',
    },
  })

  const onSubmit = async (values: SignInValues) => {
    await login(values.username, values.password)

    if (useAuthStore.getState().user) {
      window.location.href = redirectTo || getModuleRoot(selectedModule)
    }
  }

  return (
    <AuthLayout>
      <Card shadow="sm" padding="lg" radius="md">
        <Stack gap="md">
          {/* Header */}
          <div>
            <Text fw={600} size="lg">
              Multi Module Admin Login
            </Text>
            <Text size="sm" c="dimmed">
              Sign in with your module admin credentials to manage .
            </Text>
          </div>

          {/* Module selector */}
          <ModuleSelector />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="sm">
              <TextInput
                label="Username"
                placeholder="admin"
                {...register('username')}
                error={errors.username?.message}
              />

              <div>
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    Password
                  </Text>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: 12, color: 'gray' }}
                  >
                    Reset password
                  </Link>
                </Group>

                <PasswordInput
                  placeholder="********"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              {error && (
                <Text size="sm" c="red">
                  {error}
                </Text>
              )}

              <Button type="submit" loading={loading} mt="sm">
                Sign in
              </Button>
            </Stack>
          </form>

          {/* Footer */}
          <Text size="sm" c="dimmed">
            Demo defaults:{' '}
            <Badge variant="light">admin / test</Badge>
          </Text>
        </Stack>
      </Card>
    </AuthLayout>
  )
}