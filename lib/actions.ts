'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug, getSlugId } from './utils';
import { del, put } from '@vercel/blob';

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
    .optional()
    .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, { 
      error: 'Image file size must be less than 2 MB.'
    })
    .refine((file) => !file || file.size == 0 || ACCEPTED_FILE_TYPES.includes(file.type), {
      error: 'Image file type must be JPG or PNG.'
    }),
  tags: z.string().optional(),
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
  message?: string,
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

  const { title, featured_image } = validatedFields.data;
  let featuredImageUrl: string = '';

  if (featured_image && featured_image.size > 0) {
    console.log('uploading image...');
    const uploadedUrl = await uploadImage(featured_image);
    if (!uploadedUrl) {
      return {
        success: false,
        message: 'Database Error: failed to upload image.'
      };
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
  console.log(formData.get('featured_image'));
  const existingImageUrl = formData.get('existing_featured_image') as string;
  const shouldDeleteImage: boolean = formData.get('delete_featured_image') === 'true';

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
      message: 'Invalid fields. Failed to update post.',
    };
  }

  const { title, featured_image } = validatedFields.data;
  let featuredImageUrl: string = existingImageUrl;

  if (featured_image && featured_image.size > 0) {
    console.log('uploading image...');
    // Delete old image if we're replacing it with a new image
    if (existingImageUrl) {
      console.log('deleting old image...');
      await deleteImage(existingImageUrl);
      // If fails, continue anyway - better to have orphaned file than fail the update
    }

    const uploadedUrl = await uploadImage(featured_image);
    if (!uploadedUrl) {
      return {
        success: false,
        message: 'Database Error: failed to upload image.'
      };
    }
    featuredImageUrl = uploadedUrl;
  }
  else if (shouldDeleteImage && existingImageUrl) {
    // Existing image should be deleted and no new image was uploaded to replace it
    console.log('deleting image');
    await deleteImage(existingImageUrl);
    featuredImageUrl = '';
  }

  console.log({featuredImageUrl});

  const newPost = {
    ...validatedFields.data,
    slug: generateSlug(title),
    featured_image: featuredImageUrl,
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

export async function uploadImage(image: File): Promise<string | false> {
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

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    await del(imageUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
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