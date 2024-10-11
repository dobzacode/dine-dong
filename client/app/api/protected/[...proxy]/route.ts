import { getProxyBasePath } from '@/lib/utils';
import { AccessTokenError, getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { withAxiom, type AxiomRequest } from 'next-axiom';
import { NextResponse, type NextRequest } from 'next/server';

const withApiProxy = withApiAuthRequired(
  //@ts-expect-error - AxiomNextRequest extends NextRequest
  async (request: NextRequest) => await apiProxy(request, '/api/protected')
);
export const GET = withApiProxy;
export const PUT = withApiProxy;
export const POST = withApiProxy;

const apiProxy = withAxiom(async (req: AxiomRequest, proxyPath: string): Promise<Response> => {
  let accessToken;

  try {
    const accessTokenResult = await getAccessToken(req, new NextResponse(), {
      authorizationParams: { audience: 'https://dine-dong/api/' }
    });

    accessToken = accessTokenResult.accessToken;
  } catch (e: unknown) {
    req.log.error(`Error getting access token: ${e as string}`);
    if (e instanceof AccessTokenError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status ?? 401 });
    }
    throw e;
  }

  const headers = new Headers(req.headers);

  if (!accessToken) {
    req.log.error(`Access token is missing`);
    return NextResponse.json({ code: '401', message: 'Access token is missing' }, { status: 401 });
  }

  headers.set('authorization', `Bearer ${accessToken}`);
  console.log(
    `${getProxyBasePath()}/api${req.nextUrl.pathname.replace(proxyPath, '')}${req.nextUrl.search}`,
    {
      ...req,
      body: req.body && (await req.blob()),
      headers,
      method: req.method
    }
  );
  req.log.info(
    `Proxying request to ${getProxyBasePath()}/api${req.nextUrl.pathname.replace(proxyPath, '')}${req.nextUrl.search}`
  );

  return fetch(
    `${getProxyBasePath()}/api${req.nextUrl.pathname.replace(proxyPath, '')}${req.nextUrl.search}`,
    {
      ...req,
      body: req.body && (await req.blob()),
      headers,
      method: req.method
    }
  );
});
