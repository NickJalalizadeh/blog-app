'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug, getSlugId } from './utils';
import { del, put } from '@vercel/blob';
import { FormState } from '@/types/blog';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const FormSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(10, { error: 'The title must be at least 10 characters.' }),
  author: z.string().trim().min(4, { error: 'The author must be at least 4 characters.' }),
  summary: z.string().trim().min(10, { error: 'The summary must be at least 10 characters' }),
  content: z.string().trim().min(20, { error: 'The post content must be at least 20 characters.' }),
  featured_image: z.instanceof(File)
    .refine((file) => file.size <= MAX_UPLOAD_SIZE, { 
      error: 'Image file size must be less than 2 MB.'
    })
    .refine((file) => file.size == 0 || ACCEPTED_FILE_TYPES.includes(file.type), {
      error: 'Image file type must be JPG or PNG.'
    }),
  tags: z.string(),
});

const CreatePost = FormSchema.omit({ id: true });
const UpdatePost = FormSchema.omit({ id: true });

export async function createPost(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = CreatePost.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });

  const response = formData;

  if (!validatedFields.success) {
    return {
      response,
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Please fix validation errors.',
    };
  }

  const { title, featured_image } = validatedFields.data;
  let featuredImageUrl: string = '';

  if (featured_image.size > 0) {
    const uploadedUrl = await uploadImage(featured_image);
    if (!uploadedUrl) {
      return { response, message: 'Database Error: failed to upload image.' };
    }
    featuredImageUrl = uploadedUrl;
  }

  const newPost = {
    ...validatedFields.data,
    title: title.trim(),
    slug: generateSlug(title),
    featured_image: featuredImageUrl,
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
    return { response, message: 'Database Error: failed to create post.' };
  }
 
  revalidatePath(`/posts/${getSlugId(post.slug, post.id)}`);
  redirect(`/posts/${getSlugId(post.slug, post.id)}`);
}

export async function updatePost(id: string, existingImageUrl: string, prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const validatedFields = UpdatePost.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    featured_image: formData.get('featured_image'),
    tags: formData.get('tags'),
  });
  const shouldDeleteImage: boolean = formData.get('delete_featured_image') === 'true';
  const response = formData;
  
  if (!validatedFields.success) {
    return {
      response: formData,
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Please fix validation errors.',
    };
  }

  const { title, featured_image } = validatedFields.data;
  let newImageUrl = existingImageUrl;

  // Attempt to replace the existing image with a new one
  if (featured_image.size > 0) {
    const uploadedUrl = await replaceImage(featured_image, existingImageUrl);
    if (!uploadedUrl) {
      return { response, message: 'Database Error: failed to upload image.' };
    }
    newImageUrl = uploadedUrl;
  }
  // Attempt to delete the existing image if no image was selected to replace it
  else if (shouldDeleteImage && existingImageUrl) {
    await deleteImage(existingImageUrl);
    newImageUrl = '';
  }

  const newPost = {
    ...validatedFields.data,
    slug: generateSlug(title),
    featured_image: newImageUrl,
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
    return { response, message: 'Database Error: failed to update post.' };
  }

  revalidatePath(`/posts/${getSlugId(newPost.slug, id)}`);
  redirect(`/posts/${getSlugId(newPost.slug, id)}`);
}

async function replaceImage(newImage: File, existingImageUrl: string): Promise<string | false> {
  // Delete old image if we're replacing it with a new image
  if (existingImageUrl) {
    await deleteImage(existingImageUrl);
    // If fails, continue anyway - better to have orphaned file than fail the update
  }

  const uploadedUrl = await uploadImage(newImage);
  return uploadedUrl;
}

async function uploadImage(image: File): Promise<string | false> {
  try {
    const blob = await put(image.name, image, {
      access: 'public',
      addRandomSuffix: true,
    });

    return blob.url;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    await del(imageUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deletePost(id: string, prevState: FormState | undefined): Promise<FormState> {
  try {
    await sql`
      SELECT count(1) FROM posts 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: failed to delete post.' };
  }

  revalidatePath('/');
  redirect('/');
}