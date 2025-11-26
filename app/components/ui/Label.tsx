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
  const base = "block text-sm font-medium text-gray-700";
  const classes = `${base} ${className}`.trim();

  return (
    <label htmlFor={htmlFor} className={classes} {...rest}>
      {children}
      {required && (
        <>
          {" "}
          <span aria-hidden="true" className="text-melon">
            *
          </span>
          <span className="sr-only"> requerido</span>
        </>
      )}
    </label>
  );
};

export default Label;
