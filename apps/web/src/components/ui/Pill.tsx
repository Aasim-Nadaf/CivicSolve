import * as React from "react"
import { cn } from "./Button"

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "danger" | "neutral"
}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant = "neutral", children, ...props }, ref) => {
    const variants = {
      info: "bg-accent-blue-info text-white",
      success: "bg-accent-green text-ink",
      warning: "bg-accent-yellow text-ink",
      danger: "bg-accent-red text-white",
      neutral: "bg-canvas text-ink border border-hairline",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-sm text-caption leading-none whitespace-nowrap",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Pill.displayName = "Pill"

export { Pill }
