import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        "flex h-10 w-full rounded border border-foreground bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/50 focus-visible:outline-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";
