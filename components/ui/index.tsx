// components/ui/index.tsx
import React from "react";

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "default",
  ...props
}: any) => {
  const base =
    "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:pointer-events-none gap-2";
  const sizes = {
    default: "h-10 px-4 rounded-xl text-sm",
    sm: "h-8 px-3 rounded-lg text-xs",
    icon: "h-9 w-9 rounded-xl",
  };
  const variants = {
    primary:
      "bg-neutral-900 text-white hover:bg-black shadow-lg shadow-neutral-900/20",
    secondary:
      "bg-white border border-neutral-200 text-neutral-900 hover:bg-neutral-50",
    ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
    destructive:
      "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    premium:
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/50",
  };
  return (
    <button
      className={`${base} ${sizes[size as keyof typeof sizes]} ${
        variants[variant as keyof typeof variants]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = (props: any) => (
  <input
    {...props}
    className={`h-10 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 w-full transition-all placeholder:text-neutral-400 ${
      props.className || ""
    }`}
  />
);

export const Label = (props: any) => (
  <label
    {...props}
    className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 block"
  />
);

export const Textarea = (props: any) => (
  <textarea
    {...props}
    className={`min-h-[80px] p-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 w-full transition-all resize-none placeholder:text-neutral-400 ${
      props.className || ""
    }`}
  />
);

export const Badge = ({ children, className }: any) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${className}`}
  >
    {children}
  </span>
);

export const Dialog = ({ open, onOpenChange, children }: any) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    {" "}
    {children}{" "}
  </div>
);

export const DialogOverlay = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
  />
);

export const DialogContent = ({ children, className }: any) => (
  <div
    className={`relative bg-white p-0 rounded-2xl w-full max-w-5xl shadow-2xl scale-100 overflow-hidden flex flex-col h-[80vh] ${className}`}
  >
    {" "}
    {children}{" "}
  </div>
);

// Icônes utilitaires
export const Check = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);
export const CheckCircle = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
export const XCircle = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
