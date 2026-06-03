import { Post } from '@/types/blog';
import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type CreatePostData = Omit<Post, 'id' | 'published_at' | 'updated_at'>;
export type UpdatePostData = Partial<CreatePostData>;

// Fetch all posts for homepage
export async function getPosts(): Promise<Post[]> {
  try {
    const rows = await sql<Post[]>`
      SELECT * FROM posts 
      ORDER BY published_at DESC
      LIMIT 50
    `;
    return rows;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
}

// Fetch posts by query string
export async function getPostsByQuery(query: string): Promise<Post[]> {
  try {
    const pattern = `%${query}%`;
    const rows = await sql<Post[]>`
      SELECT * FROM posts
      WHERE
        title    ILIKE ${pattern} OR
        author   ILIKE ${pattern} OR
        summary  ILIKE ${pattern} OR
        tags     ILIKE ${pattern}
      ORDER BY published_at DESC
      LIMIT 50
    `;
    return rows;
  } catch (error) {
    console.error('Failed to search posts:', error);
    throw error;
  }
}

// Fetch single post by slug
export async function getPostByShortId(shortId: string): Promise<Post | null> {
  try {
    const rows = await sql<Post[]>`
      SELECT * FROM posts 
      WHERE short_id = ${shortId}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// Fetch single post by ID
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const rows = await sql<Post[]>`
      SELECT * FROM posts 
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}