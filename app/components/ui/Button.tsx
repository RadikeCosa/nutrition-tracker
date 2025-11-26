import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3";

    const variantClasses = {
      primary:
        "bg-[var(--color-accent)] text-[var(--color-background)] hover:bg-[var(--color-accent)]/80 focus:ring-[var(--color-accent)] border-2 border-[var(--color-accent)]",
      secondary:
        "bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[var(--color-surface)]/80 focus:ring-[var(--color-surface)] border-2 border-[var(--color-accent)]",
    };

    const loadingClasses = isLoading ? "cursor-wait" : "";

    const classes = [
      baseClasses,
      variantClasses[variant],
      loadingClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
