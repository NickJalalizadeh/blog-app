'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug, getSlugId } from './utils';
import { put } from '@vercel/blob';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const FormSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(10, { error: 'The title must be at least 10 characters.' }),
  author: z.string().trim().min(4, { error: 'The author must be at least 4 characters.' }),
  summary: z.string().trim().min(10, { error: 'The summary must be at least 10 characters' }),
  content: z.string().trim().min(20, { error: 'The post content must be at least 20 characters.' }),
  featured_image: z.string().optional(),
  tags: z.string().optional(),
});

const CreatePost = FormSchema.omit({ id: true });
const UpdatePost = FormSchema.omit({ id: true });

const UploadImage = z.object({
  image: z.instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, { 
      error: 'Image file size must be less than 2 MB.'
    })
    .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
      error: 'Image file type must be JPG or PNG.'
    }),
})

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
  message?: string,
};

export type ImageState = {
  success?: boolean,
  url?: string,
  errors?: string[],
  message?: string,
}

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
  console.log({data: validatedFields.data});
  const { title } = validatedFields.data;

  const newPost = {
    ...validatedFields.data,
    slug: generateSlug(title),
    updated_at: new Date(),
  }

  try {
    await sql`
      UPDATE posts 
      SET ${sql(newPost)}
      WHERE id = ${id}
    `;
  } catch(error) {
    console.error(error);
    return { succeess: false, message: 'Database Error: failed to update post.' };
  }

  revalidatePath(`/posts/${getSlugId(newPost.slug, id)}`);
  redirect(`/posts/${getSlugId(newPost.slug, id)}`);
}

export async function uploadImage(prevState: ImageState | undefined, image: File) {
  console.log({image});

  const validatedFields = UploadImage.safeParse({ image });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties?.image?.errors,
      message: 'Invalid fields. Failed to upload image.',
    };
  }

  try {
    const blob = await put(image.name, image, {
      access: 'public',
      addRandomSuffix: true,
    });

    return { success: true, url: blob.url };
  } catch (error) {
    return { success: false, message: 'Database Error: Failed to upload image.' };
  }
}

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