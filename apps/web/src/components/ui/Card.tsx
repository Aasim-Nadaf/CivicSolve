import * as React from "react"
import { cn } from "./Button"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    | "feature" 
    | "feature-dark" 
    | "pricing" 
    | "category-purple" 
    | "category-pink" 
    | "category-blue" 
    | "category-orange" 
    | "category-green"
  hover?: boolean
  elevation?: 0 | 1 | 2 | 3 | 4
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "feature", hover = false, elevation = 0, ...props }, ref) => {
    
    const variants = {
      "feature": "bg-canvas text-ink border border-hairline",
      "feature-dark": "bg-primary text-on-primary",
      "pricing": "bg-canvas text-ink border border-hairline",
      "category-purple": "bg-accent-purple text-white border-none",
      "category-pink": "bg-accent-pink text-white border-none",
      "category-blue": "bg-accent-blue text-white border-none",
      "category-orange": "bg-accent-orange text-white border-none",
      "category-green": "bg-accent-green text-ink border-none",
    }

    const elevations = {
      0: "",
      1: "shadow-[var(--shadow-level-1)]",
      2: "shadow-[var(--shadow-level-2)]",
      3: "shadow-[var(--shadow-level-3)]",
      4: "shadow-[var(--shadow-level-4)]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md p-3xl transition-all duration-300 ease-out",
          variants[variant],
          elevations[elevation],
          hover && "hover:shadow-[var(--shadow-level-2)] hover:-translate-y-1",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
