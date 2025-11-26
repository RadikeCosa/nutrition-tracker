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
        "bg-melon text-white hover:bg-melon/80 focus:ring-melon border-2 border-melon",
      secondary:
        "bg-peach text-gray-800 hover:bg-peach/80 focus:ring-peach border-2 border-peach",
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
