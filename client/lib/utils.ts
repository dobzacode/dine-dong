import { type OrderStatusEnum } from '@/types/schema';
import { clsx, type ClassValue } from 'clsx';
import { Children, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getBasePath = () => {
  const env = process.env.NODE_ENV;
  if (typeof window !== 'undefined') {
    return env === 'production' ? 'https://dine-dong.fr' : 'http://localhost:3000';
  }
  if (env === 'production') {
    return 'https://dine-dong.fr';
  }
  return 'http://localhost:3000';
};

export const getProxyBasePath = () => {
  return process.env.NODE_ENV === 'production' ? 'https://dine-dong.fr' : 'http://localhost:8000';
};

export const constructURLWithFileOrKey = (file: File | string | undefined) => {
  if (!file) return '';
  if (typeof file === 'string') {
    return constructS3Url(file);
  }
  return URL.createObjectURL(file);
};

export const getFileExtension = (filename: string) => {
  const index = filename.lastIndexOf('.');
  if (index === -1) {
    return '';
  }
  return filename.substring(index);
};

export const constructS3Url = (key: string) =>
  `${process.env.NEXT_PUBLIC_CLOUDFRONT_BUCKET_URL}${key}`;

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getChildByDisplayName = (
  displayName: string,
  children: React.ReactNode
): React.ReactNode[] | null => {
  const child = Children.map(children, (child) => {
    //@ts-expect-error - type is valid
    if (isValidElement(child) && child.type.displayName === displayName) return child;
    return null;
  });
  if (!child) return null;
  return child;
};

export const translateStatus = (status: keyof typeof OrderStatusEnum) => {
  switch (status) {
    case 'FINALIZED':
      return 'Terminée';
    case 'CANCELLED':
      return 'Annulée';
    case 'IN_PROGRESS':
      return 'En cours';
  }
};
