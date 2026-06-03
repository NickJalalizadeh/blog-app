import { Post } from "@/types/blog";
import { use } from "react";
import { Button } from "./ui/button";
import BlogCard from "./BlogCard";

export default function PostsResults({ postsPromise, query, onClear, hasError }: {
  postsPromise: Promise<Post[]>;
  query: string;
  onClear: () => void;
  hasError: boolean;
}) {
  const posts = use(postsPromise);

  if (hasError || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg mb-4">
          {hasError? (
            <>There was an error searching for posts. Please try again.</>
          ) : (
            <>No posts have been found matching the search: <span className="text-foreground">{query}</span></>
          )}
        </p>
        <Button variant="link" onClick={onClear}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="absolute text-muted-foreground text-sm -top-7">
        {posts.length} post{posts.length === 1 ? '' : 's'} found
      </p>
      <div className="posts-grid">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}