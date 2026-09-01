import * as React from "react"
import { cn } from "./Button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-xl bg-white/[0.04] border border-border-default px-4 py-2.5",
            "text-[15px] text-text-primary placeholder:text-text-muted",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue/40 focus:bg-white/[0.06]",
            "hover:border-border-strong hover:bg-white/[0.05]",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
