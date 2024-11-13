import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_AUTH0_CALLBACK_URL;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const CLIENT_SECRET = import.meta.env.VITE_AUTH0_CLIENT_SECRET;

export { DOMAIN, CLIENT_ID, REDIRECT_URI, AUDIENCE, CLIENT_SECRET };

export const Auth0ProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate('/callback');
  };

  if (!(DOMAIN && CLIENT_ID && REDIRECT_URI && AUDIENCE)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{
        audience: AUDIENCE,
        redirect_uri: REDIRECT_URI,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};
