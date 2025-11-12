import React from "react";

interface FeedbackMessageProps {
  type: "success" | "error";
  message: string;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
}) => (
  <div
    style={{
      padding: "10px",
      marginBottom: "15px",
      backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
      color: type === "success" ? "#155724" : "#721c24",
      border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
      borderRadius: "4px",
    }}
    role="alert"
  >
    {message}
  </div>
);
