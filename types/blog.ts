export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  published_at: Date;
  updated_at: Date;
  featured_image?: string;
}