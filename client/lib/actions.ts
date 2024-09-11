'use server';

import { revalidateTag } from 'next/cache';

export const customRevalidateTag = (tag: string | string[]) => {
  if (typeof tag === 'string') {
    revalidateTag(tag);
  } else {
    tag.forEach((t) => revalidateTag(t));
  }
};
