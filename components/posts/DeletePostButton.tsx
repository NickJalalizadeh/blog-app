'use client';

import { deletePost } from "@/lib/actions";
import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import useActionErrorToast from "@/hooks/useActionErrorToast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DeletePostButton({ id, className }: { id: string, className?: string }) {
  const deletePostWithId = deletePost.bind(null, id);
  const [state, formAction, isLoading] = useActionState(deletePostWithId, undefined);
  useActionErrorToast(state);

  function handleDelete() {
    startTransition(() => {
      formAction();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading} className={className}>Delete Post</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the post and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isLoading} onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}