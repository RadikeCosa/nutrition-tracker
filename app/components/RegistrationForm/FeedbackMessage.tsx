import React from "react";

interface FeedbackMessageProps {
  type: "success" | "error";
  message: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
}) => {
  const baseClasses =
    "w-full rounded-md p-3 text-sm flex items-start gap-2 border";

  const typeClasses = {
    success: "bg-mint/20 border-mint text-gray-800",
    error: "bg-coral/20 border-coral text-gray-800",
  };

  const icon =
    type === "success" ? (
      <svg
        className="h-5 w-5 shrink-0 text-mint"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-5 w-5 shrink-0 text-coral"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    );

  const classes = [baseClasses, typeClasses[type]].join(" ");

  return (
    <div role="alert" aria-live="polite" className={classes}>
      {icon}
      <p className="leading-tight">{message}</p>
    </div>
  );
};
