import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/types/blog';
import { getPosts, getPostsByQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';

  if (!query) {
    const rows = await getPosts();
    return NextResponse.json<Post[]>(rows);
  }

  const rows = await getPostsByQuery(query);
  return NextResponse.json<Post[]>(rows);
}