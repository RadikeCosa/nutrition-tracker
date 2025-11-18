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

  return (
    <div
      className={`mt-1 ${containerClass} ${className}`.trim()}
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-center gap-2 px-4 py-3 border rounded-md cursor-pointer
            transition-colors
            ${
              value === option.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }
            ${hasError && !value ? "border-red-600" : ""}
          `.trim()}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
