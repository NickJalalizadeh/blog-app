import Link from "next/link";
import { getPosts } from "@/lib/db";
import type { Post } from "@/types/blog";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const posts: Post[] = await getPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="max-w-3xl mb-20">
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
          Stories worth your time
        </h2>
        <p className="text-xl text-muted-foreground text-balance">
          Exploring the intersection of technology, culture, and human experience through thoughtful long-form writing.
        </p>
      </div>

      {/* Blog Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-6">No posts yet. Be the first to write something!</p>
          <Link 
            href="/posts/new"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/posts/${post.slug}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-accent/50 hover:-translate-y-1">
                {post.featured_image && (
                  <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wider">
                    {formatDate(post.published_at)}
                  </div>
                  <CardTitle className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base line-clamp-3">
                    {post.summary}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    By {post.author}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}