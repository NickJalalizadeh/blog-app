import EditBlogForm from "@/components/posts/EditBlogForm";
import { resolvePostFromSlugId } from "@/lib/posts/resolvePostFromSlugId";

interface EditPostPageProps {
  params: Promise<{ slugId: string; }>;
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const slugId = params.slugId;

  const post = await resolvePostFromSlugId(slugId, {
    redirectOnMismatch: false
  });

  return (
    <>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-8">
        Edit Post
      </h1>
      <EditBlogForm post={post} />
    </>
  );
}