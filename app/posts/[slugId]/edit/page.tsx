import DeletePostButton from "@/components/posts/DeletePostButton";
import EditBlogForm from "@/components/posts/EditBlogForm";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { resolvePostFromSlugId } from "@/lib/posts/resolvePostFromSlugId";
import { ChevronDownIcon } from "lucide-react";

interface EditPostPageProps {
  params: Promise<{ slugId: string; }>;
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const slugId = params.slugId;

  const post = await resolvePostFromSlugId(slugId, {
    redirectOnMismatch: false
  });

  return (
    <>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-8">Edit Post</h1>

      <EditBlogForm post={post}/>
      
      <Collapsible className="w-full sm:max-w-1/2 ml-auto mt-24 -mb-36">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="group text-destructive hover:text-red-700 w-full flex justify-between">
            Danger Zone<ChevronDownIcon className="ml-6 group-data-[state=open]:rotate-180"/>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <DeletePostButton id={post.id} className="w-full"/>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}