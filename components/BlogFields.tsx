import { FormStateErrors } from '@/lib/actions';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';

export default function BlogFields({
  defaultValues,
  errors,
  errorMessage,
}: {
  defaultValues?: { title?: string; author?: string; summary?: string; content?: string; tags?: string; featuredImage?: string; },
  errors?: FormStateErrors,
  errorMessage?: string | null,
}) {
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            defaultValue={defaultValues?.title}
            placeholder="Enter post title"
            autoComplete="off"
          />
          {errors?.title?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        <Field>
          <FieldLabel htmlFor="author">Author</FieldLabel>
          <Input
            id="author"
            name="author"
            defaultValue={defaultValues?.author}
            placeholder="Author name"
            autoComplete="off"
          />
          {errors?.author?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        <Field>
          <FieldLabel htmlFor="summary">Summary</FieldLabel>
          <Textarea
            id="summary"
            name="summary"
            defaultValue={defaultValues?.summary}
            placeholder="Short summary of the post"
            rows={3}
            autoComplete="off"
          />
          {errors?.summary?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        <Field>
          <FieldLabel htmlFor="content">Content</FieldLabel>
          <Textarea
            id="content"
            name="content"
            defaultValue={defaultValues?.content}
            placeholder="Write your blog post content here..."
            rows={12}
            autoComplete="off"
          />
          {errors?.content?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        <Field>
          <FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
          <Input
            id="tags"
            name="tags"
            defaultValue={defaultValues?.tags}
            placeholder="Tags that describe your post"
            autoComplete="off"
          />
          {errors?.tags?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        <Field>
          <FieldLabel htmlFor="featured_image">Featured Image URL</FieldLabel>
          <Input
            id="featured_image"
            name="featured_image"
            defaultValue={defaultValues?.featuredImage}
            placeholder="https://example.com/image.jpg"
            autoComplete="off"
          />
          {errors?.featured_image?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
        </Field>
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </FieldGroup>
    </FieldSet>
  )
}