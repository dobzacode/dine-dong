import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import { withAxiom } from 'next-axiom';

export const GET = withAxiom(
  // eslint-disable-next-line
  handleAuth({
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
  })
);
