import { toast, type ExternalToast } from "sonner";

type ToastAction = { label: string; onClick: () => void };

type AppToastOptions = ExternalToast & {
  description?: string;
  action?: ToastAction;
};

const duration = {
  success: 4000,
  error: 6500,
  warning: 5200,
  info: 4500,
} as const;

function withDefaults(
  opts: AppToastOptions | undefined,
  fallbackDuration: number
): ExternalToast {
  const { description, action, ...rest } = opts ?? {};
  return {
    duration: fallbackDuration,
    ...(description != null ? { description } : {}),
    ...(action ? { action } : {}),
    ...rest,
  };
}

/** Toasts alineados al producto: título corto + descripción accionable en español. */
export const appToast = {
  success(message: string, opts?: AppToastOptions) {
    return toast.success(message, withDefaults(opts, duration.success));
  },
  warning(message: string, opts?: AppToastOptions) {
    return toast.warning(message, withDefaults(opts, duration.warning));
  },
  error(message: string, opts?: AppToastOptions) {
    return toast.error(message, withDefaults(opts, duration.error));
  },
  info(message: string, opts?: AppToastOptions) {
    return toast.info(message, withDefaults(opts, duration.info));
  },
};
