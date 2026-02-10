'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(10, { error: 'The title must be at least 10 characters.' }),
  slug: z.string().min(10, { error: 'The slug must be at least 10 characters.' }),
  author: z.string().min(4, { error: 'The author must be at least 4 characters.' }),
  summary: z.string({error: 'Please add a summary'}).nonempty({ error: 'Please enter a summary' }),
  content: z.string(),
  featured_image: z.string(),
  tags: z.string(),
});

const CreatePost = FormSchema.omit({ id: true });
const UpdatePost = FormSchema.omit({ id: true });

export type FormState = {
  errors?: {
    title?: { errors: string[] };
    slug?: { errors: string[] };
    author?: { errors: string[] };
    summary?: { errors: string[] };
    content?: { errors: string[] };
    featured_image?: { errors: string[] };
    tags?: { errors: string[] };
  };
  message?: string | null;
};

export async function createPost(prevState: FormState | undefined, formData: FormData) {
  const validatedFields = CreatePost.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Invalid fields. Failed to create post.',
    };
  }

  const newPost = {
    ...validatedFields.data,
    published_at: new Date(),
  }

  try {
    await sql`INSERT INTO posts ${sql(newPost)}`;
  } catch(error) {
    console.error(error);
    return { message: 'Database Error: failed to create post.' };
  }
 
  revalidatePath(`/posts/${newPost.slug}`);
  redirect(`/posts/${newPost.slug}`);
}

export async function updatePost(id: string, prevState: FormState | undefined, formData: FormData) {
  const validatedFields = UpdatePost.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Invalid fields. Failed to update post.',
    };
  }

  const updatedPost = {
    ...validatedFields.data,
    updated_at: new Date(),
  }

  try {
    await sql`
      UPDATE posts 
      SET ${sql(updatedPost)}
      WHERE id = ${id}
    `;
  } catch(error) {
    console.error(error);
    return { message: 'Database Error: failed to update post.' };
  }
 
  revalidatePath(`/posts/${updatedPost.slug}`);
  redirect(`/posts/${updatedPost.slug}`);
}