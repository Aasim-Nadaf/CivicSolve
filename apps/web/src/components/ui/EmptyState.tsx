import * as React from "react";
import { cn } from "./Button";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center bg-canvas border border-hairline rounded-md",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-full border border-hairline flex items-center justify-center text-mute mb-5">
        {icon}
      </div>
      <h3 className="text-display-sm text-ink mb-2">{title}</h3>
      <p className="text-body-sm text-body-mid mb-6">{description}</p>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
