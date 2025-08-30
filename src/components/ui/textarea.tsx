import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-xl border border-foreground/20 bg-background px-3 py-2 text-sm placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };

