import React from "react";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", hasError = false, options, children, ...rest }, ref) => {
    const base =
      "mt-1 w-full px-4 py-2 border rounded-md bg-[var(--color-surface-light)] text-base text-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-(--color-accent) border-[var(--color-surface)] shadow-sm";
    const error = hasError
      ? " border-(--color-error) focus:ring-(--color-error)"
      : "";
    const classes = `${base}${error} ${className}`.trim();

    return (
      <select ref={ref} className={classes} {...rest}>
        {children}
        {!children &&
          options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
