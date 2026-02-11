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
    `;
    return rows;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
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
export async function getPostById(id: number): Promise<Post | null> {
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

// Create new post
export async function createPost(data: CreatePostData): Promise<Post | null> {
  try {
    const rows = await sql<Post[]>`
      INSERT INTO posts (title, slug, summary, content, author, featured_image)
      VALUES (${data.title}, ${data.slug}, ${data.summary}, ${data.content}, ${data.author}, ${data.featured_image || null})
      RETURNING *
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to create post:', error);
    return null;
  }
}

// Update existing post
export async function updatePost(id: number, data: UpdatePostData): Promise<Post | null> {
  try {

    const updatedPost = {
      ...data,
      updated_at: 'CURRENT_TIMESTAMP',
    };

    const query = `
      UPDATE posts 
      SET ${sql(updatedPost)}
      WHERE id = ${id}
      RETURNING *
    `;

    console.log(query);

    const rows = await sql<Post[]>`${query}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Failed to update post:', error);
    return null;
  }
}

// Delete post
export async function deletePost(id: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM posts 
      WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Failed to delete post:', error);
    return false;
  }
}