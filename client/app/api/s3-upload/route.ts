import { sanitizeKey, uuid } from 'next-s3-upload';
import { POST as route } from 'next-s3-upload/route';
import { type NextRequest } from 'next/server';

export const POST = route.configure({
  async key(req: NextRequest, filename) {
    try {
      const url = new URL(req.url);
      const params = url.searchParams;
      const folder = params.get('folder');
      return `${folder}/${uuid()}-${sanitizeKey(filename)}`;
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      return `/${filename}`;
    }
  }
});
