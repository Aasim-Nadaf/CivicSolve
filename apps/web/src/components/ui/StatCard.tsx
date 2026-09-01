import * as React from "react"
import { cn } from "./Button"
import { Card } from "./Card"

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: { value: string; positive: boolean }
  className?: string
}

export function StatCard({ icon, value, label, trend, className }: StatCardProps) {
  return (
    <Card
      variant="feature"
      elevation={1}
      className={cn("p-5 flex flex-col justify-between", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-mute shrink-0">
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-caption px-2 py-1 rounded-sm",
              trend.positive
                ? "text-accent-green bg-canvas border border-hairline"
                : "text-accent-red bg-canvas border border-hairline"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <div className="text-display-md mb-1">{value}</div>
        <div className="text-body-sm text-mute">{label}</div>
      </div>
    </Card>
  )
}
