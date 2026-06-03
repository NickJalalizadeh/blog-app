'use client';

import { useState, useRef, Suspense } from 'react';
import { Post } from '@/types/blog';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { Button } from './ui/button';
import { normalize, debounce } from '@/lib/utils';
import BlogCardSkeleton from './BlogCardSkeleton';
import PostsResults from './PostsResults';
import SearchBar from './SearchBar';

function SkeletonGrid() {
  return (
    <div className="posts-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

type SearchStatusType = 
  { state: 'idle'; } |
  { state: 'active'; promise: Promise<Post[]> | null; } |
  { state: 'error'; promise: Promise<Post[]>; };

export default function PostsGrid({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>({state: 'idle'});
  const abortRef = useRef<AbortController>(null);

  const searchPosts = useRef(
    debounce(async (query: string, signal: AbortSignal) => {
      if (!normalize(query)) {
        setSearchStatus({state: 'idle'});
        return;
      }

      const encodedQuery = encodeURIComponent(normalize(query));
      const promise = fetch(`/api/posts/search?q=${encodedQuery}`, { signal })
        .then((result) => {
          return result.json();
        })
        .catch((error) => {
          if ((error as Error).name === 'AbortError') {
            return new Promise<Post[]>(() => {});
          }
          setSearchStatus({state: 'error', promise});
        });

        setSearchStatus({state: 'active', promise});
    }, 400)
  ).current;

  const handleSearch = (queryValue: string) => {
    abortRef.current?.abort();
    setQuery(queryValue);
    setSearchStatus({state: 'active', promise: null});

    abortRef.current = new AbortController();
    searchPosts(queryValue, abortRef.current.signal);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg mb-6">
          No posts yet. Be the first to write something!
        </p>
        <Button asChild size="lg">
          <Link href="/posts/create">Create Your First Post</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SearchBar query={query} onSearch={handleSearch} onClear={() => handleSearch('')} />

      {searchStatus.state === 'idle' ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : searchStatus.promise ? (
        <Suspense fallback={<SkeletonGrid />}>
          <PostsResults
            postsPromise={searchStatus.promise}
            query={query}
            onClear={() => handleSearch('')}
            hasError={searchStatus.state === 'error'}
          />
        </Suspense>
      ) : (
        <SkeletonGrid />
      )}
    </>
  );
}