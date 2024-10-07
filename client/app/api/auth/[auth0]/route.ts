import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// eslint-disable-next-line
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'https://dine-dong/api/'
    }
  }),
  logout: handleLogout({
    logoutParams: {
      audience: 'https://dine-dong/api/'
    }
  }),
  onError(_: Request, error: Error) {
    console.error(error);
  }
});
