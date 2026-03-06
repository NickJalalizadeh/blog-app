'use client';

import { deletePost } from "@/lib/actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import useActionErrorToast from "@/hooks/useActionErrorToast";

export default function DeletePostButton({ id }: { id: string }) {
  const deletePostWithId = deletePost.bind(null, id);
  const [state, formAction, isLoading] = useActionState(deletePostWithId, undefined);
  useActionErrorToast(state);

  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive" disabled={isLoading}>
        Delete Post
      </Button>
    </form>
  );
}