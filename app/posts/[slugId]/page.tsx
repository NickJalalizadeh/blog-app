import BlogPost from "@/components/BlogPost";
import { resolvePostFromSlugId } from "@/lib/posts/resolvePostFromSlugId";

interface PostPageProps {
  params: Promise<{ slugId: string; }>;
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const slugId = params.slugId;

  const post = await resolvePostFromSlugId(slugId, {
    redirectOnMismatch: true
  });

  return (
    <BlogPost post={post}></BlogPost>
  );
}