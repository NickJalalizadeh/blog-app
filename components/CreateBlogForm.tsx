'use client';

import { FormState, createPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import BlogFields from './BlogFields';
import Link from 'next/link';

export default function CreateBlogForm() {
  const initialState: FormState = {message: null, errors: {}};
  const [state, formAction, isLoading] = useActionState(createPost, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <BlogFields errors={state.errors} errorMessage={state.message}></BlogFields>
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">Create Post</Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}