import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Text, TextInput, PasswordInput, Group, Stack, Box } from '@mantine/core';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { AuthLayout } from '@/features/auth/auth-layout';
import { useAuthStore } from '@/stores/auth-store';

const signInSchema = z.object({
  username: z.string().min(1, 'Please enter your username'),
  password: z.string().min(1, 'Please enter your password'),
});

type SignInValues = z.infer<typeof signInSchema>;

export function RxSignIn({ redirectTo }: { redirectTo?: string }) {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

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
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      await login(values.username, values.password);

      const authState = useAuthStore.getState();

      if (authState.user) {
        const firstModule = authState.modules[0];
        const fallbackRoot = '/';
        const targetUrl = redirectTo || firstModule?.root || fallbackRoot;
        const finalUrl = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
        window.location.href = finalUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <AuthLayout>
      <Card shadow="sm" padding="lg" radius="md">
        <Stack gap="md">
          <div>
            <Text fw={600} size="lg">
              RxSoft Admin
            </Text>
            <Text size="sm" c="dimmed">
              Sign in with your credentials
            </Text>
          </div>

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
                  <Text fw={500} size="sm" component="label">
                    Password
                  </Text>
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
        </Stack>
      </Card>
    </AuthLayout>
  );
}
