import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Cargando…",
  description = "Esto debería tardar solo un momento.",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      <Loader2
        className="size-10 animate-spin text-blue-600"
        aria-hidden
      />
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        {description ? (
          <p className="mt-1 max-w-sm text-sm text-gray-600">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-14 text-center ${className}`}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Icon className="size-7" aria-hidden />
      </div>
      <div className="max-w-md">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      {children ? <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  title = "Algo salió mal",
  description,
  onRetry,
  retryLabel = "Reintentar",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-4 py-14 text-center ${className}`}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="size-7" aria-hidden />
      </div>
      <div className="max-w-md">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="default" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
