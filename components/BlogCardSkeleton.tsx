import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogCardSkeleton() {
  return (
    <Card className="h-full pt-0">
      <Skeleton className="aspect-video w-full rounded-b-none" />
      <CardHeader>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-3 w-2/5" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-1/3" />
      </CardFooter>
    </Card>
  )
}