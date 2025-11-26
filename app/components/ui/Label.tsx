import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  className = "",
  required = false,
  ...rest
}) => {
  const base = "block text-sm font-medium text-[var(--color-primary)]";
  const classes = `${base} ${className}`.trim();

  return (
    <label htmlFor={htmlFor} className={classes} {...rest}>
      {children}
      {required && (
        <>
          {" "}
          <span aria-hidden="true" className="text-(--color-accent)">
            *
          </span>
          <span className="sr-only"> requerido</span>
        </>
      )}
    </label>
  );
};

export default Label;
