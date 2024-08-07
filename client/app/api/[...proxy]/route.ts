import { AccessTokenError, getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

const withApiProxy = withApiAuthRequired(async (request) => await apiProxy(request, '/api'));
export const GET = withApiProxy;
export const PUT = withApiProxy;

async function apiProxy(request: NextRequest, proxyPath: string): Promise<Response> {
  let accessToken;
  try {
    const accessTokenResult = await getAccessToken(request, new NextResponse());
    console.log(accessTokenResult);
    accessToken = accessTokenResult.accessToken;
  } catch (e: unknown) {
    if (e instanceof AccessTokenError) {
      return NextResponse.json({ code: e.code, message: e.message }, { status: e.status ?? 401 });
    }
    throw e;
  }

  const headers = new Headers(request.headers);

  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  return fetch(
    `http://localhost:8080/api${request.nextUrl.pathname.replace(proxyPath, '')}${request.nextUrl.search}`,
    {
      ...request,
      body: request.body && (await request.blob()),
      headers,
      method: request.method
    }
  );
}
