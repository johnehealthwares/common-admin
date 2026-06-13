import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
// Styles
// import './styles/index.css'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { notifications } from '@mantine/notifications';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import axios, { AxiosError } from 'axios';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { handleServerError } from '@/lib/handle-server-error';
import { useAuthStore } from '@/stores/auth-store';
import { FontProvider } from './context/font-provider';
import { ModuleProvider } from './context/module-provider';
import { ThemeProvider } from './context/theme-provider';
import { ViewProvider } from './context/view-provider';
// import { DirectionProvider } from './context/direction-provider'
// import { FontProvider } from './context/font-provider'
// Generated Routes
import { routeTree } from './routeTree.gen';
// import './styles/tailwind-fallback.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            notifications.show({
              title: 'Status',
              message: 'Content not modified!',
              color: 'yellow',
            });
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          notifications.show({ title: 'Session expired!', message: error.message, color: 'red' });
          useAuthStore.getState().logout();
          const redirect = `${router.history.location.href}`;
          router.navigate({ to: '/sign-in', search: { redirect } });
        }
        if (error.response?.status === 500) {
          notifications.show({ title: 'Server Error', message: error.message, color: 'red' });
          // Only navigate to error page in production to avoid disrupting HMR in development
          if (import.meta.env.PROD) {
            router.navigate({ to: '/500' });
          }
        }
        if (error.response?.status === 403) {
          router.navigate({ to: '/403', replace: true });
        }
      }
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <ThemeProvider>
            <FontProvider>
              <ModuleProvider>
                <ViewProvider>
                  <RouterProvider router={router} />
                </ViewProvider>
              </ModuleProvider>
            </FontProvider>
          </ThemeProvider>
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
