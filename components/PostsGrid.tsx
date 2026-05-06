'use client';

import { useState, useMemo } from 'react';
import { Post } from '@/types/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Field, FieldDescription } from './ui/field';

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function matchesQuery(post: Post, query: string): boolean {
  const queryNormal = normalize(query);
  return (
    normalize(post.title).includes(queryNormal) ||
    normalize(post.author).includes(queryNormal) ||
    normalize(post.summary).includes(queryNormal) ||
    normalize(post.tags ?? '').includes(queryNormal)
  );
}

export default function PostsGrid({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (normalize(query).length === 0)
      return posts;
    return posts.filter((p) => matchesQuery(p, query));
  }, [posts, query]);

  const hasQuery = normalize(query).length > 0;

  return (
    <>
      {/* Search bar */}
      <Field className="mb-12 max-w-lg">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or topic..."
            aria-label="Search posts"
          />
          {hasQuery && (
            <InputGroupAddon align="inline-end">
              <Button variant="ghost" size="icon-sm" onClick={() => setQuery('')} aria-label="Clear search">
                <X />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        {hasQuery && filteredPosts.length > 0 && (
          <FieldDescription>
            {filteredPosts.length} post{filteredPosts.length === 1 ? '' : 's'} found
          </FieldDescription>
        )}
      </Field>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">
            No posts yet. Be the first to write something!
          </p>
          <Button asChild size="lg">
            <Link href="/posts/create">Create Your First Post</Link>
          </Button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No posts have been found matching the search <span className="text-foreground">{query}</span>
          </p>
          <Button variant="link" onClick={() => setQuery('')}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}