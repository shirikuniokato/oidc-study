import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  readonly children: ReactNode;
  readonly className?: string;
}

function Tooltip({ children, className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
    </span>
  );
}

function TooltipTrigger({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return <span className={cn("cursor-help", className)}>{children}</span>;
}

function TooltipContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
