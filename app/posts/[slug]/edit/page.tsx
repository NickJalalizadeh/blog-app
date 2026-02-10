import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db";
import EditBlogForm from "@/components/EditBlogForm";

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-8">
        Edit Post
      </h1>
      <EditBlogForm post={post} />
    </>
  );
}