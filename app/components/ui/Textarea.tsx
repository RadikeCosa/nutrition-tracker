import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError = false, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border rounded-md bg-[var(--color-surface-light)] text-base text-[var(--color-secondary)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-(--color-accent) border-[var(--color-surface)] shadow-sm";
    const error = hasError
      ? " border-(--color-error) focus:ring-(--color-error)"
      : "";
    const classes = `${base}${error} ${className}`.trim();

    return <textarea ref={ref} className={classes} {...rest} />;
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
