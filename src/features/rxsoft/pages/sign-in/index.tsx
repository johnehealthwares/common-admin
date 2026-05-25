import {
  Button,
  Card,
  Text,
  TextInput,
  PasswordInput,
  Badge,
  Group,
  Stack,
  Box,
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { AuthLayout } from '@/features/auth/auth-layout'
import { useModuleDefinition } from '@/context/module-context'
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
  const user = useAuthStore((state) => state.user)
  const moduleDefinition = useModuleDefinition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: 'admin',
      password: 'password',
    },
  })
  const onSubmit = async (values: SignInValues) => {
    try {
      await login(values.username, values.password)
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const authState = useAuthStore.getState()
      console.log('Login attempt complete. User:', authState.user, 'Error:', authState.error)

      if (authState.user) {
        const targetUrl = redirectTo || moduleDefinition?.root || '/'
        const finalUrl = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`
        
        console.log('Login successful, redirecting to:', finalUrl)
        window.location.href = finalUrl
      } else if (authState.error) {
        console.warn('Login failed with error:', authState.error)
      }
    } catch (err) {
      console.error('Login error:', err)
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
                <Box mb="xs">
                  <Group justify="space-between">
                    <Box component="label" fw={500} size="sm">
                      Password
                    </Box>
                    <Link
                      to="/forgot-password"
                      style={{ fontSize: 12, color: 'gray' }}
                    >
                      Reset password
                    </Link>
                  </Group>
                </Box>

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
          <Box mt="md">
            <Group gap="xs" align="center">
              <Text size="sm" c="dimmed">
                Demo defaults:
              </Text>
              <Badge variant="light">admin / test</Badge>
            </Group>
          </Box>
        </Stack>
      </Card>
    </AuthLayout>
  )
}