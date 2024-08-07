import { handleAuth, handleLogin, type HandleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: 'http://localhost:8080/api/'
    }
  }),
  onError(_: Request, error: Error) {
    console.error(error);
  }
}) as HandleAuth;
