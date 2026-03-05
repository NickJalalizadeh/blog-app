import { FormValues, Post } from "@/types/blog";
import BlobImage from "@/types/BlobImage";
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

export function getFormValues(formData: FormData, existingImageUrl: string = ''): FormValues {
  const featuredImage = formData.get('featured_image') as File;
  const shouldDeleteImage: boolean = formData.get('delete_featured_image') === 'true';
  const image = featuredImage.size === 0 && !shouldDeleteImage ? existingImageUrl : featuredImage;

  return {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    summary: formData.get('summary') as string,
    content: formData.get('content') as string,
    featured_image: new BlobImage(image),
    tags: formData.get('tags') as string,
  };
}

export function getFormValuesFromPost(post: Post): FormValues {
  return {
    ...post,
    featured_image: new BlobImage(post.featured_image),
  }
}