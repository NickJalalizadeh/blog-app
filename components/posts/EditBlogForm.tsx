'use client';

import { Post } from '@/types/blog';
import { updatePost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import BlogFields from './BlogFields';
import Link from 'next/link';
import { getFormValues, getFormValuesFromPost, getSlugId } from '@/lib/utils';
import useActionErrorToast from '@/hooks/useActionErrorToast';

export default function EditBlogForm({ post }: { post: Post }) {
  const updatePostWithId = updatePost.bind(null, post.id, post.featured_image);
  const [state, formAction, isLoading] = useActionState(updatePostWithId, {});
  useActionErrorToast(state);

  const formValues = state?.response? getFormValues(state.response, post.featured_image) : getFormValuesFromPost(post);
  
  return (
    <form action={formAction} className="space-y-6">
      <BlogFields defaultValues={formValues} errors={state?.errors}></BlogFields>
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">Update Post</Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/posts/${getSlugId(post.slug, post.id)}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}