'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug, getSlugId } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(10, { error: 'The title must be at least 10 characters.' }),
  author: z.string().min(4, { error: 'The author must be at least 4 characters.' }),
  summary: z.string(),
  content: z.string().min(20, { error: 'The post content must be at least 20 characters.' }),
  featured_image: z.string(),
  tags: z.string(),
});

const CreatePost = FormSchema.omit({ id: true });
const UpdatePost = FormSchema.omit({ id: true });

export type FormStateErrors = {
  title?: { errors: string[] };
  author?: { errors: string[] };
  summary?: { errors: string[] };
  content?: { errors: string[] };
  featured_image?: { errors: string[] };
  tags?: { errors: string[] };
};

export type FormState = {
  success?: boolean,
  errors?: FormStateErrors,
  message?: string | null;
};

export async function createPost(prevState: FormState | undefined, formData: FormData) {
  const validatedFields = CreatePost.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Invalid fields. Failed to create post.',
    };
  }

  const { title } = validatedFields.data;

  const newPost = {
    ...validatedFields.data,
    title: title.trim(),
    slug: generateSlug(title),
    published_at: new Date(),
  }

  let post;
  try {
    const rows = await sql`
      INSERT INTO posts ${sql(newPost)}
      RETURNING id, slug
    `;
    post = rows[0];
  } catch(error) {
    console.error(error);
    return { success: false, message: 'Database Error: failed to create post.' };
  }
 
  revalidatePath(`/posts/${getSlugId(post.slug, post.id)}`);
  redirect(`/posts/${getSlugId(post.slug, post.id)}`);
}

export async function updatePost(id: string, prevState: FormState | undefined, formData: FormData) {
  const validatedFields = UpdatePost.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Invalid fields. Failed to update post.',
    };
  }

  const { title } = validatedFields.data;

  const updatedPost = {
    ...validatedFields.data,
    title: title.trim(),
    slug: generateSlug(title),
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
    return { succeess: false, message: 'Database Error: failed to update post.' };
  }

  revalidatePath(`/posts/${getSlugId(updatedPost.slug, id)}`);
  redirect(`/posts/${getSlugId(updatedPost.slug, id)}`);
}

// Delete post
export async function deletePost(id: string, prevState: FormState | undefined) {
  try {
    await sql`
      SELECT count(1) FROM posts 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Database Error: failed to delete post.' };
  }

  revalidatePath('/');
  redirect('/');
}