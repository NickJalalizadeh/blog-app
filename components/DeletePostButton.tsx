'use client';

import { deletePost } from "@/lib/actions";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function DeletePostButton({ id }: { id: string }) {
  const deletePostWithId = deletePost.bind(null, id);
  const [state, formAction, isLoading] = useActionState(deletePostWithId, undefined);

  useEffect(() => {
    if (state?.message)
      toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive" disabled={isLoading}>
        Delete Post
      </Button>
    </form>
  );
}