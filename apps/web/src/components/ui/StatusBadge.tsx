import * as React from "react"
import { cn } from "./Button"

const statusConfig = {
  OPEN: {
    bgColor: "bg-accent-yellow",
    textColor: "text-ink",
    label: "Open",
  },
  IN_PROGRESS: {
    bgColor: "bg-accent-blue-info",
    textColor: "text-white",
    label: "In Progress",
  },
  RESOLVED: {
    bgColor: "bg-accent-green",
    textColor: "text-ink",
    label: "Resolved",
  },
  CLOSED: {
    bgColor: "bg-canvas",
    textColor: "text-mute",
    border: "border border-hairline",
    label: "Closed",
  },
}

type StatusType = keyof typeof statusConfig

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status as StatusType] || statusConfig.OPEN

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-caption",
        config.bgColor,
        config.textColor,
        'border' in config ? config.border : "",
        className
      )}
    >
      {config.label}
    </span>
  )
}
