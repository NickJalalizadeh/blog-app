import { useEffect } from "react";
import { toast } from "sonner";

type ActionState = {
  message?: string,
}

export default function useActionErrorToast(state?: ActionState) {
  useEffect(() => {
    if (state?.message) {
      toast.error(state?.message);
    }
  }, [state]);
}
