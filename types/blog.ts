export interface Post {
  id: string;
  short_id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  featured_image?: string;
  tags: string;
  published_at: Date;
  updated_at: Date;
}