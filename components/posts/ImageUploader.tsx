'use client'

import { uploadImage } from '@/lib/actions';
import { startTransition, useActionState, useRef, useState } from 'react';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import Image from 'next/image';
import useActionErrorToast from '@/hooks/useActionErrorToast';
import { Spinner } from '../ui/spinner';
import clsx from 'clsx';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { extractFilename } from '@/lib/utils';

export default function ImageUploader({ featuredImageUrl } : { featuredImageUrl?: string | undefined }) {
  const [previewUrl, setPreviewUrl] = useState(featuredImageUrl);
  const [state, uploadAction, isUploading] = useActionState(uploadImage, undefined);
  const [fileName, setFileName] = useState(featuredImageUrl ? extractFilename(featuredImageUrl) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useActionErrorToast(state);

  console.log({errors: state?.errors});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    startTransition(() => {
      uploadAction(file);
    });
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col gap-4 items-start">
        <Field>
          {/* Hidden input to store the uploaded URL */}
          <input type="hidden" name="featured_image" value={state?.url || ''} />

          <FieldLabel htmlFor="featured_image">Featured Image</FieldLabel>

          {/* Hidden file input referenced by button */}
          <Input
            ref={fileInputRef}
            id="featured_image"
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
            aria-invalid={!!state?.errors?.length}
          />
          
          {fileName && (
            <p className="text-foreground text-sm line-clamp-1">{fileName}</p>
          )}

          {state?.errors?.map(e =>
            <FieldError key={e}>{e}</FieldError>
          )}
        </Field>

        {/* Upload button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="size-4" data-icon="inline-start"/>
          {previewUrl ? 'Replace Image' : 'Select Image'}
        </Button>
      </div>

      {/* Preview */}
      <div className="relative max-w-xs rounded-md">
        {previewUrl && (
          <Image 
            src={previewUrl} 
            alt="Preview" 
            width={1600}
            height={900}
            className={clsx('rounded-md cursor-pointer', {'opacity-50': isUploading})}
            onClick={() => fileInputRef.current?.click()}
          />
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md text-white bg-black/40">
            <Spinner className="size-6" />
            <p>Uploading</p>
          </div>
        )}
      </div>
    </div>
  );
}