import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError = false, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border border-peach rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-melon";
    const error = hasError ? " border-coral focus:ring-coral" : "";
    const classes = `${base}${error} ${className}`.trim();

    return <textarea ref={ref} className={classes} {...rest} />;
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
