import { getPosts } from "@/lib/db";
import type { Post } from "@/types/blog";
import PostsGrid from "@/components/PostsGrid";

export default async function HomePage() {
  const posts: Post[] = await getPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
          Stories worth your time
        </h2>
        <p className="text-xl text-muted-foreground text-balance">
          Exploring the intersection of technology, culture, and human experience through thoughtful long-form writing.
        </p>
      </div>

      <PostsGrid posts={posts} />
    </div>
  );
}