import type { ReactNode } from "react";
import { cn } from "./ui/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

/** Contenedor estándar para vistas del panel: padding responsivo y ancho máximo. */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8",
        className
      )}
    >
      {children}
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-6 sm:mb-8", className)}>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      {description != null && description !== "" ? (
        <div className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base [&_strong]:font-semibold [&_strong]:text-gray-800">
          {description}
        </div>
      ) : null}
    </header>
  );
}
