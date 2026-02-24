'use client'

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { createFileList, getImageProperties } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import ImagePreview from '@/components/posts/ImagePreview';

type ImageUploaderProps = {
  image: Blob | string,
  errors?: string[] | undefined,
};

type ImageState = {
  previewUrl: string | undefined, 
  fileName: string | undefined, 
  isMarkedForDeletion: boolean,
}

export default function ImageUploader({ image, errors } : ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFiles = useRef<FileList>(null);
  const [imageUrl, imageFileName] = getImageProperties(image);
  const [imageState, setImageState] = useState<ImageState>({
    previewUrl: imageUrl,
    fileName: imageFileName,
    isMarkedForDeletion: false,
  });

  useEffect(() => {
    if (!fileInputRef.current) return;
    if (image instanceof Blob) {
      const files = createFileList(image, imageState.fileName || 'featured_image.jpg');
      fileInputRef.current.files = files;
      selectedFiles.current = files;
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // If the file dialog box is cancelled, file is removed on some browsers. So add it back here.
      e.target.files = selectedFiles.current;
      return;
    }
    
    // Show preview immediately
    const [previewUrl, fileName] = getImageProperties(file);
    setImageState({
      previewUrl,
      fileName,
      isMarkedForDeletion: false,
    });
    
    selectedFiles.current = e.target.files;
  };

  const handleRemoveImage = () => {
    setImageState({
      previewUrl: undefined,
      fileName: undefined,
      isMarkedForDeletion: true,
    });
    
    // Clear the file input
    if (fileInputRef.current)
      fileInputRef.current.value = '';
    selectedFiles.current = null;
  };

  return (
    <div className="flex gap-2">
      <Field>
        <FieldLabel htmlFor="featured_image">Featured Image</FieldLabel>

        <div className="flex-1 flex flex-col gap-4 items-start">
          {/* Hidden input stores existing image URL */}
          <input type="hidden" name="existing_featured_image" value={imageUrl || ''} />
          {/* Hidden input stores request to delete image */}
          <input type="hidden" name="delete_featured_image" value={imageState.isMarkedForDeletion ? 'true' : 'false'} />

          {/* Hidden file input referenced by upload button */}
          <input
            ref={fileInputRef}
            id="featured_image"
            name="featured_image"
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleFileChange}
            aria-invalid={!!errors?.length}
          />
          
          {imageState.fileName && (
            <p className="text-sm line-clamp-1">{imageState.fileName}</p>
          )}

          {/* Upload button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" data-icon="inline-start"/>
            {imageState.previewUrl ? 'Replace Image' : 'Select Image'}
          </Button>

          {errors?.map(e =>
            <FieldError key={e}>{e}</FieldError>
          )}
        </div>
      </Field>

      {/* Preview Image */}
      {imageState.previewUrl && (
        <ImagePreview
          url={imageState.previewUrl} 
          onReplace={() => fileInputRef.current?.click()} 
          onRemove={handleRemoveImage} 
        />
      )}
    </div>
  );
}