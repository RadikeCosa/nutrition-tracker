import React from "react";

interface FeedbackMessageProps {
  type: "success" | "error";
  message: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
}) => {
  const style =
    type === "success"
      ? {
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "8px",
          borderRadius: "4px",
          marginBottom: "8px",
        }
      : {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "8px",
          borderRadius: "4px",
          marginBottom: "8px",
        };

  return (
    <div role="alert" style={style} aria-live="polite">
      {message}
    </div>
  );
};
