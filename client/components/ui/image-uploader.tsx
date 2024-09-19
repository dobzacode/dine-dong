'use-client';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { constructURLWithFileOrKey } from '@/lib/utils';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import type { UseFormReturn } from 'react-hook-form';
import type { MealSchema } from '../meal/meal-form/meal-schema';

export default function ImageUploader({
  form,
  className,
  label = 'Photo'
}: {
  form: UseFormReturn<MealSchema>;
  className?: string;
  label?: string;
}) {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(
    form.getValues().stepOne.image ? constructURLWithFileOrKey(form.getValues().stepOne.image) : ''
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        if (!acceptedFiles[0]) return;
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue('stepOne.image', acceptedFiles[0]);
        form.clearErrors('stepOne.image');
      } catch (error) {
        console.log(error);
        setPreview(null);
        form.resetField('stepOne.image');
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
    accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [], 'image/webp': [] }
  });

  return (
    <FormItem className={className}>
      <FormLabel className={`${fileRejections.length !== 0 && 'text-destructive'}`}>
        {label}
      </FormLabel>
      <FormControl>
        <div
          {...getRootProps()}
          className="card mx-auto flex w-full cursor-pointer flex-col items-center justify-center gap-md p-8"
        >
          {preview && (
            <Image
              src={preview as string}
              alt="Image ajoutée"
              sizes={''}
              width={400}
              height={400}
              className="max-h-[400px] w-auto rounded-sm"
            />
          )}
          <ImagePlus
            strokeWidth={0.5}
            className={`size-20 text-primary-900 opacity-20 ${preview ? 'hidden' : 'block'}`}
          />
          <Input {...getInputProps()} type="file" />
          {isDragActive ? (
            <p className="body text-center text-primary-900/[0.4]">Lachez l&apos;image!</p>
          ) : (
            <p className="body text-center text-primary-900/[0.4]">
              Cliquez ici ou glissez une image
            </p>
          )}
        </div>
      </FormControl>
      <FormMessage>
        {fileRejections.length !== 0 && (
          <p className="body-sm text-center">
            L&apos;image doit peser moins de 5MB et être de type png, jpg, or jpeg
          </p>
        )}
      </FormMessage>
    </FormItem>
  );
}
