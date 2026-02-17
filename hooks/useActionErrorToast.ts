import { useEffect } from "react";
import { toast } from "sonner";

type ActionState = {
  success?: boolean,
  message?: string,
}

export default function useActionErrorToast(state: ActionState | undefined) {
  useEffect(() => {
    if (state?.success === false && state?.message) {
      toast.error(state?.message);
    }
  }, [state]);
}
