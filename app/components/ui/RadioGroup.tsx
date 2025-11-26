import React from "react";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  hasError?: boolean;
  layout?: "vertical" | "grid";
  className?: string;
  "aria-labelledby"?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  hasError = false,
  layout = "vertical",
  className = "",
  "aria-labelledby": ariaLabelledBy,
}) => {
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
      : "flex flex-col gap-3";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const getLabelClasses = (optionValue: string) => {
    const baseClasses =
      "flex items-center gap-2 px-4 py-3 border rounded-md cursor-pointer transition-colors";

    const stateClasses =
      value === optionValue
        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
        : "border-[var(--color-surface)] bg-[var(--color-surface-light)] hover:border-[var(--color-accent)]/60";

    const errorClasses =
      hasError && !value ? "border-[var(--color-error)]" : "";

    return [baseClasses, stateClasses, errorClasses].filter(Boolean).join(" ");
  };

  return (
    <div
      className={[containerClass, "mt-1", className].filter(Boolean).join(" ")}
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option) => (
        <label key={option.value} className={getLabelClasses(option.value)}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="w-4 h-4 text-(--color-accent) focus:ring-2 focus:ring-(--color-accent) accent-(--color-accent)"
          />
          <span className="text-sm font-medium text-[var(--color-secondary)]">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
