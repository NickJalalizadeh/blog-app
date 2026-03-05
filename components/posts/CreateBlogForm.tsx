'use client';

import { createPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import BlogFields from './BlogFields';
import Link from 'next/link';
import useActionToast from '@/hooks/useActionToast';
import { getFormValues } from '@/lib/utils';

export default function CreateBlogForm() {
  const [state, formAction, isLoading] = useActionState(createPost, {});
  useActionToast(state);

  const formValues = state?.response && getFormValues(state.response);

  return (
    <form action={formAction} className="space-y-6">
      <BlogFields defaultValues={formValues} errors={state?.errors}></BlogFields>
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">Create Post</Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}