import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { sanitizeKey, uuid } from 'next-s3-upload';
import { POST as route } from 'next-s3-upload/route';

export const POST = withApiAuthRequired(
  route.configure({
    async key(req, filename) {
      try {
        const url = req.url.split('?')[1];
        const params = new URLSearchParams(url);
        const folder = params.get('folder');

        return `${folder}/${uuid()}-${sanitizeKey(filename)}`;
      } catch (error) {
        console.error('Error parsing JSON body:', error);
        return `${filename}`;
      }
    }
  })
);
