"use client";

interface ConfirmSubmitButtonProps {
  confirmMessage: string;
  className?: string;
  children: React.ReactNode;
}

export function ConfirmSubmitButton({
  confirmMessage,
  className,
  children
}: ConfirmSubmitButtonProps) {
  return (
    <button
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {children}
    </button>
  );
}
