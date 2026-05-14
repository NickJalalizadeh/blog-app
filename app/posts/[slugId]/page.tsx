import BlogPost from "@/components/posts/BlogPost";
import { resolvePostFromSlugId } from "@/lib/posts/resolvePostFromSlugId";
import { getSlugId } from "@/lib/utils";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";

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
    <>
      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />Back to all posts
        </Link>
        <Link href={`/posts/${getSlugId(post.slug, post.id)}/edit`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Pencil size={16} />Edit
        </Link>
      </div>

      <BlogPost post={post}></BlogPost>
    </>
  );
}