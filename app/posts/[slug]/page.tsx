import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db";
import BlogPost from "@/components/BlogPost";

interface PostPageProps {
  params: Promise<{ slug: string; }>;
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPost post={post}></BlogPost>
  );
}