import { notFound, redirect } from "next/navigation"
import { getSlugId, parseSlugId } from "../utils"
import { getPostByShortId } from "../db"
import { Post } from "@/types/blog";

export async function resolvePostFromSlugId(
  slugId: string,
  options?: { redirectOnMismatch?: boolean }
): Promise<Post> {
  const parsed = parseSlugId(slugId);

  if (!parsed)
    notFound();

  const { slug, shortId } = parsed;
  const post = await getPostByShortId(shortId);

  if (!post)
    notFound();

  // Redirect if slug changed
  if (options?.redirectOnMismatch && post.slug !== slug) {
    redirect(`/posts/${getSlugId(slug, shortId)}`);
  }

  return post;
}