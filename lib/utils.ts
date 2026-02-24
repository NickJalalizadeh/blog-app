import { FormResponse } from "@/types/blog";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Used for post URLs
export function getSlugId(slug: string, id: string): string {
  return `${slug}-${id.slice(0, 8)}`;
}

export function parseSlugId(slugId: string) {
  const lastDashIdx = slugId.lastIndexOf('-');
  if (lastDashIdx === -1)
    return null;

  return {
    slug: slugId.slice(0, lastDashIdx),
    shortId: slugId.slice(lastDashIdx + 1),
  }
}

export function extractFilenameFromUrl(url: string): string {
  if (url === '') return '';
  const pathname = new URL(url).pathname;
  const filename = pathname.split('/').pop() || '';
  
  // Remove Vercel Blob hash pattern: -[alphanumeric] before extension
  const match = filename.match(/^(.+)-[A-Za-z0-9]+(\.[^.]+)$/);
  
  return match ? match[1] + match[2] : filename;
}

export function getImageProperties(image: Blob | string) {
  let url, fileName;
  if (typeof image === 'string') {
    url = image;
    fileName = extractFilenameFromUrl(url);
  }
  else if (image instanceof File && image.size > 0) {
    url = URL.createObjectURL(image);
    fileName = image.name;
  }

  return [ url, fileName ];
}

export function createFileList(blob: Blob, fileName: string): FileList {
  const file = new File([blob], fileName, { 
    type: blob.type,
  });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}

export function constructFormResponse(formData: FormData): FormResponse {
  const featuredImage = formData.get('featured_image') as File;
  const existingImageUrl = formData.get('existing_featured_image') as string;
  const shouldDeleteImage = formData.get('delete_featured_image') === 'true';

  const imageResponse = featuredImage.size === 0 && !shouldDeleteImage ? existingImageUrl : featuredImage;

  return {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    summary: formData.get('summary') as string,
    content: formData.get('content') as string,
    featured_image: imageResponse,
    tags: formData.get('tags') as string,
  };
}