import { AdminLayout } from './Layout';
import { ThemeProvider } from './ThemeProvider';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { Login } from './Pages/Login';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './Pages/Errors/ErrorFallback';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MessageModal } from './Components/Modals/MessageModal';
import { ColorScheme, ColorSchemeProvider, Loader } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { useAuth0 } from '@auth0/auth0-react';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  if (isLoading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <Loader variant="dots" />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <ThemeProvider theme={{ colorScheme }}>
          <QueryClientProvider client={queryClient}>
            <ModalsProvider modals={{ message: MessageModal }}>
              <NotificationsProvider>
                {isAuthenticated ? <AdminLayout /> : <Login />}
              </NotificationsProvider>
            </ModalsProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ColorSchemeProvider>
    </ErrorBoundary>
  );
}
