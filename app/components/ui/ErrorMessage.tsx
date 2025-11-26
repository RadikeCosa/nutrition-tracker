import React from "react";

export interface ErrorMessageProps {
  /**
   * Mensaje de error a mostrar. Si no hay mensaje, el componente no renderiza nada.
   */
  message?: string;

  /**
   * ID opcional para vincular con aria-describedby del input asociado.
   */
  id?: string;

  /**
   * Clases CSS adicionales para extender estilos.
   */
  className?: string;
}

/**
 * Componente para mostrar mensajes de error de validación de forma consistente.
 *
 * @example
 * ```tsx
 * <ErrorMessage message={errors.email?.message} id="email-error" />
 * ```
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  id,
  className = "",
}) => {
  if (!message) return null;

  return (
    <span
      id={id}
      className={`text-sm text-coral mt-1 block ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      {message}
    </span>
  );
};
