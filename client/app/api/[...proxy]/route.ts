import { type NextRequest } from 'next/server';

export const GET = apiProxy;
export const PUT = apiProxy;
export const POST = apiProxy;

async function apiProxy(request: NextRequest, proxyPath: string): Promise<Response> {
  const headers = new Headers(request.headers);

  return fetch(
    `http://localhost:8080/${request.nextUrl.pathname.replace(proxyPath, '')}${request.nextUrl.search}`,
    {
      ...request,
      body: request.body && (await request.blob()),
      headers,
      method: request.method
    }
  );
}
