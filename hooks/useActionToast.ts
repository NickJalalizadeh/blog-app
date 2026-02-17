import { useEffect } from "react";
import { toast } from "sonner";

type ActionState = {
  success?: boolean,
  message?: string,
}

type UseActionToastOptions = {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
};

export default function useActionToast(
  state: ActionState | undefined,
  options: UseActionToastOptions = { showSuccessMessage: true, showErrorMessage: true },
) {
  useEffect(() => {
    if (state?.success === true && state?.message && options.showSuccessMessage) {
      toast.success(state.message);
    }

    if (state?.success === false && options.showErrorMessage) {
      toast.error(state.message || 'Something went wrong');
    }
  }, [state]);
}
