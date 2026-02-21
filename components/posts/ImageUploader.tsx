'use client'

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { extractFilenameFromBlob } from '@/lib/utils';
import { useRef, useState } from 'react';
import ImagePreview from '@/components/posts/ImagePreview';

type ImageUploaderProps = {
  featuredImageUrl?: string | undefined,
  errors?: string[] | undefined,
};
type ImageState = {
  selectedFiles: FileList | null, 
  previewUrl: string | undefined, 
  fileName: string | undefined, 
  isMarkedForDeletion: boolean,
}

export default function ImageUploader({ featuredImageUrl, errors } : ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageState, setImageState] = useState<ImageState>({
    selectedFiles: null,
    previewUrl: featuredImageUrl,
    fileName: featuredImageUrl && extractFilenameFromBlob(featuredImageUrl),
    isMarkedForDeletion: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // If file dialog box in cancelled, file is removed on some browsers. So add it back here.
      e.target.files = imageState.selectedFiles;
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setImageState({
      selectedFiles: e.target.files,
      previewUrl: objectUrl,
      fileName: file.name,
      isMarkedForDeletion: false,
    });
  };

  const handleRemoveImage = () => {
    setImageState({
      selectedFiles: null,
      previewUrl: undefined,
      fileName: undefined,
      isMarkedForDeletion: true,
    });
    
    // Clear the file input
    if (fileInputRef.current)
      fileInputRef.current.value = '';
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col gap-4 items-start">
        <Field>
          <FieldLabel htmlFor="featured_image">Featured Image</FieldLabel>

          {/* Hidden input stores existing image URL */}
          <input type="hidden" name="existing_featured_image" value={featuredImageUrl} />
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
            <p className="text-foreground text-sm line-clamp-1">{imageState.fileName}</p>
          )}

          {errors?.map(e =>
            <FieldError key={e}>{e}</FieldError>
          )}
        </Field>

        {/* Upload button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" data-icon="inline-start"/>
          {imageState.previewUrl ? 'Replace Image' : 'Select Image'}
        </Button>
      </div>

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