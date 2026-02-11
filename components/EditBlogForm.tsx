'use client';

import { Post } from '@/types/blog';
import { FormState, updatePost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useActionState } from 'react';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from './ui/field';

export default function EditBlogForm({ post }: { post: Post }) {
  const updatePostWithId = updatePost.bind(null, post.id);

  const initialState: FormState = {message: null, errors: {}};
  const [state, formAction] = useActionState(updatePostWithId, initialState);

  const loading = false;

  return (
    <form action={formAction} className="space-y-6">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              defaultValue={post.title}
              placeholder="Enter post title"
              autoComplete="off"
            />
            {state.errors?.title?.errors?.map(error => <FieldError key={error}>{error}</FieldError>)}
          </Field>
          <Field>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <Input
              id="slug"
              name="slug"
              defaultValue={post.slug}
              placeholder="url-friendly-slug"
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="author">Author</FieldLabel>
            <Input
              id="author"
              name="author"
              defaultValue={post.author}
              placeholder="Author name"
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="summary">Summary</FieldLabel>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={post.summary}
              placeholder="Short summary of the post"
              rows={3}
              autoComplete="off"
            />
            {state.errors?.summary?.errors?.map(error => 
              <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </Field>
          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              placeholder="Write your blog post content here..."
              rows={12}
              autoComplete="off"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
            <Input
              id="tags"
              name="tags"
              defaultValue={post.tags}
              placeholder="react, typescript, nextjs"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="featured_image">Featured Image URL</FieldLabel>
            <Input
              id="featured_image"
              name="featured_image"
              defaultValue={post.featured_image}
              placeholder="https://example.com/image.jpg"
              autoComplete="off"
            />
          </Field>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Update Post'}
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
          {state.message && <FieldError>{state.message}</FieldError>}
        </FieldGroup>
      </FieldSet>
    </form>
  );
}