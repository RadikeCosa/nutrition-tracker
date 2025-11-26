import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError = false, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border border-peach rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-melon";
    const error = hasError ? " border-coral focus:ring-coral" : "";
    const classes = `${base}${error} ${className}`.trim();

    return <input ref={ref} className={classes} {...rest} />;
  }
);

Input.displayName = "Input";

export default Input;
