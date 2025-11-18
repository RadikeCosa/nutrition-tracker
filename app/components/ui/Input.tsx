import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError = false, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500";
    const error = hasError ? " border-red-600 focus:ring-red-500" : "";
    const classes = `${base}${error} ${className}`.trim();

    return <input ref={ref} className={classes} {...rest} />;
  }
);

Input.displayName = "Input";

export default Input;
