import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "text-arrow" | "icon-circular"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const variants = {
      primary: "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]",
      secondary: "bg-canvas text-ink border border-hairline hover:bg-black/5 active:scale-[0.98]",
      "text-arrow": "bg-transparent text-ink hover:underline",
      "icon-circular": "bg-canvas text-ink border border-hairline rounded-full hover:bg-black/5 active:scale-[0.98]"
    }

    const sizes = {
      sm: "text-button-md px-3 py-1.5 rounded-sm gap-1.5",
      md: "text-button-md px-xl py-md rounded-sm gap-2", // md is 12px vertical, xl is 20px horizontal
      lg: "text-button-md px-3xl py-md rounded-sm gap-2.5",
    }
    
    // Circular icons shouldn't use the standard padding
    const isIcon = variant === "icon-circular";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2",
          "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
          variants[variant],
          !isIcon && sizes[size],
          isIcon && "w-10 h-10",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
