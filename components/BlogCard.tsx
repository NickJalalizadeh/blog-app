import Link from "next/link";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Post } from "@/types/blog";
import { formatDate, getSlugId } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link 
      href={`/posts/${getSlugId(post.slug, post.id)}`}
      className="group"
    >
      <Card className="h-full pt-0 transition-all duration-300 hover:shadow-lg hover:border-accent/50 hover:-translate-y-1 hover:brightness-95">
        {post.featured_image ? (
            <Image 
              src={post.featured_image} 
              alt={post.title}
              height={900}
              width={1600}
              className="w-full rounded-t-xl aspect-video object-cover overflow-hidden"
            />
        ) : <div className="w-full bg-black/35 rounded-t-xl aspect-video"></div>}
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            {post.title}
          </CardTitle>
          <CardDescription className="text-xs tracking-wider">
            {formatDate(post.published_at)}
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">New</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-base line-clamp-3">{post.summary}</p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
            By {post.author}
        </CardFooter>
      </Card>
    </Link>
  )
}
