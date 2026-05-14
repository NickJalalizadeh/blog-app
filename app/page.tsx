import { getPosts } from "@/lib/db";
import type { Post } from "@/types/blog";
import PostsGrid from "@/components/PostsGrid";

export default async function HomePage() {
  const posts: Post[] = await getPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
      <PostsGrid posts={posts} />
    </div>
  );
}