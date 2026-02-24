export interface Post {
  id: string;
  short_id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  featured_image: string;
  tags: string;
  published_at: Date;
  updated_at: Date;
}

export interface FormErrors {
  title?: { errors: string[] };
  author?: { errors: string[] };
  summary?: { errors: string[] };
  content?: { errors: string[] };
  featured_image?: { errors: string[] };
  tags?: { errors: string[] };
};

export interface FormResponse {
  title: string,
  author: string,
  summary: string,
  content: string,
  featured_image: Blob | string,
  tags: string,
};

export interface FormState {
  success: boolean,
  response: FormResponse,
  errors?: FormErrors,
  message?: string,
};