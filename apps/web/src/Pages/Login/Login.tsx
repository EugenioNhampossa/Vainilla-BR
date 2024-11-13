import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from '../../Components/PageLoader';
import { useEffect } from 'react';
import { Loader } from '@mantine/core';

export function Login() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: '/',
        },
      });
    }
  }, []);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Loader variant="dots" />
    </div>
  );
}
