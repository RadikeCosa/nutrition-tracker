import React from "react";

interface FeedbackMessageProps {
  type: "success" | "error";
  message: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
}) => {
  const base = "w-full rounded-md p-3 text-sm flex items-start gap-2";

  const successStyles = "bg-green-100 border border-green-200 text-green-800";
  const errorStyles = "bg-red-100 border border-red-200 text-red-800";

  const icon =
    type === "success" ? (
      <svg
        className="h-5 w-5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-5 w-5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4h2v2H9v-2zm0-8h2v6H9V6z"
          clipRule="evenodd"
        />
      </svg>
    );

  const className = `${base} ${
    type === "success" ? successStyles : errorStyles
  }`;

  return (
    <div role="alert" aria-live="polite" className={className}>
      {icon}
      <p className="leading-tight">{message}</p>
    </div>
  );
};
