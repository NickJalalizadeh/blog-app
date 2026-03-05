'use client';

import { Post } from '@/types/blog';
import { updatePost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import BlogFields from './BlogFields';
import Link from 'next/link';
import { getSlugId } from '@/lib/utils';
import useActionErrorToast from '@/hooks/useActionErrorToast';
import BlogImage from '@/types/BlogImage';

export default function EditBlogForm({ post }: { post: Post }) {
  const updatePostWithId = updatePost.bind(null, post.id, post.featured_image);
  const [state, formAction, isLoading] = useActionState(updatePostWithId, {
    success: true,
    response: {...post, featured_image: new BlogImage(post.featured_image)}
  });
  useActionErrorToast(state);
  
  return (
    <form action={formAction} className="space-y-6">
      <BlogFields defaultValues={state.response} errors={state.errors}></BlogFields>
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">Update Post</Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/posts/${getSlugId(post.slug, post.id)}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}