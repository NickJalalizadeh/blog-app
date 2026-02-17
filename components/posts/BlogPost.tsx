import { Post } from "@/types/blog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image";
import { formatDate, getSlugId } from "@/lib/utils"
import DeletePostButton from "./DeletePostButton";

const BlogPost = ({ post }: { post: Post }) => {
  return (
    <article>
      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-[21/9] overflow-hidden rounded-lg mb-8">
          <Image 
            src={post.featured_image} 
            className="w-full h-full object-cover"
            width={2100}
            height={900}
            alt={post.title}
          />
        </div>
      )}

      {/* Meta Information */}
      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <time>{formatDate(post.published_at)}</time>
          <span>•</span>
          <span>By {post.author}</span>
        </div>
        
        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
          {post.title}
        </h1>
        
        {/* Summary */}
        <p className="text-xl text-muted-foreground text-balance leading-relaxed">
          {post.summary}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border/40 my-12"></div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border/40 mt-16 pt-8">
        <div className="flex justify-between gap-4">
          <Button asChild>
            <Link href={`/posts/${getSlugId(post.slug, post.id)}/edit`}>
              Edit Post
            </Link>
          </Button>
          <DeletePostButton id={post.id} />
        </div>
      </div>
    </article>
  )
}

export default BlogPost