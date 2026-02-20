import { FormStateErrors } from '@/lib/actions';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from './ImageUploader';

export default function BlogFields({
  defaultValues,
  errors,
  errorMessage,
}: {
  defaultValues?: { title?: string; author?: string; summary?: string; content?: string; tags?: string; featured_image?: string; },
  errors?: FormStateErrors,
  errorMessage?: string | null,
}) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Header</FieldLegend>
        <FieldDescription>Info that appears at the top of your post</FieldDescription>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                defaultValue={defaultValues?.title}
                placeholder="Enter post title"
                autoComplete="off"
                aria-invalid={!!errors?.title?.errors?.length}
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
                aria-invalid={!!errors?.author?.errors?.length}
              />
              {errors?.author?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
            </Field>
          </div>
          {/* Image File Picker */}
          <ImageUploader featuredImageUrl={defaultValues?.featured_image} errors={errors?.featured_image?.errors} />
          <Field>
            <FieldLabel htmlFor="summary">Summary</FieldLabel>
            <FieldDescription>Hook the reader in with a short summary of the post.</FieldDescription>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={defaultValues?.summary}
              placeholder="Short summary of the post"
              rows={5}
              autoComplete="off"
              aria-invalid={!!errors?.summary?.errors?.length}
            />
            {errors?.summary?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Content & Metadata</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="content">Post Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              defaultValue={defaultValues?.content}
              placeholder="Write your blog post content here..."
              rows={12}
              autoComplete="off"
              aria-invalid={!!errors?.content?.errors?.length}
            />
            {errors?.content?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>
          <Field>
            <FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
            <FieldDescription>Help readers search for your post more easily by adding tags.</FieldDescription>
            <Input
              id="tags"
              name="tags"
              defaultValue={defaultValues?.tags}
              placeholder="Tags that describe your post"
              autoComplete="off"
              aria-invalid={!!errors?.tags?.errors?.length}
            />
            {errors?.tags?.errors?.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>
          {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  )
}