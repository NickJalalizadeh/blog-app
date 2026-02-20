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

export function extractFilenameFromBlob(url: string): string {
  const pathname = new URL(url).pathname;
  const filename = pathname.split('/').pop() || '';
  
  // Remove Vercel Blob hash pattern: -[alphanumeric] before extension
  const match = filename.match(/^(.+)-[A-Za-z0-9]+(\.[^.]+)$/);
  
  return match ? match[1] + match[2] : filename;
}