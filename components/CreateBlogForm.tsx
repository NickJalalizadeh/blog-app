'use client';

import { FormState, createPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';

export default function CreateBlogForm() {
  const initialState: FormState = {message: null, errors: {}};
  const [state, formAction] = useActionState(createPost, initialState);

  const loading = false;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter post title"
        />
        {state.errors?.title?.errors?.map(error => 
          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          placeholder="url-friendly-slug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          required
          placeholder="Author name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          
          placeholder="Short summary of the post"
          rows={3}
        />
        {state.errors?.summary?.errors?.map(error => 
          <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          placeholder="Write your blog post content here..."
          rows={12}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="react, typescript, nextjs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured_image">Featured Image URL</Label>
        <Input
          id="featured_image"
          name="featured_image"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Create Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          // onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
      {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}
    </form>
  );
}