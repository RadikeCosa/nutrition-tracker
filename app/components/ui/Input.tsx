import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError = false, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border rounded-md bg-[var(--color-surface-light)] text-base text-[var(--color-secondary)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] border-[var(--color-surface)] shadow-sm";
    const error = hasError
      ? " border-[var(--color-error)] focus:ring-[var(--color-error)]"
      : "";
    const classes = `${base}${error} ${className}`.trim();

    return <input ref={ref} className={classes} {...rest} />;
  }
);

Input.displayName = "Input";

export default Input;
