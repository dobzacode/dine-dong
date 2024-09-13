'use server';

import { kv } from '@vercel/kv';
import { revalidateTag } from 'next/cache';

export const customRevalidateTag = (tag: string | string[]) => {
  if (typeof tag === 'string') {
    revalidateTag(tag);
  } else {
    tag.forEach((t) => revalidateTag(t));
  }
};

export const delRedisKey = async (key: string) => {
  console.log(key);
  await kv.del(key);
};
