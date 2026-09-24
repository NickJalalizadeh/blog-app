import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listPosts() {
  const rows = await sql`SELECT COUNT(*) FROM posts`;
  return rows;
}

export async function GET() {
  try {
  	return Response.json(await listPosts());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
