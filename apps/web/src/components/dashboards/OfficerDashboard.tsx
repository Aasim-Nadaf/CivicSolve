"use client";
import * as React from "react";
import { updateReportStatus, allocateBudget } from "@/actions/officer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Status } from "db";

const categoryIcons: Record<string, string> = {
  POTHOLES: "🕳️",
  STREETLIGHTS: "💡",
  TREE_PLANTING: "🌳",
  DRAINAGE: "🚰",
  FLOOD: "🌊",
  OTHER: "📋",
};

const sdgColors: Record<
  string,
  "info" | "success" | "warning" | "danger" | "neutral"
> = {
  "9": "warning",
  "11": "info",
  "13": "success",
  "16": "neutral",
};

export default function OfficerDashboard({
  initialQueue,
}: {
  initialQueue: any[];
}) {
  const [expandedBudget, setExpandedBudget] = React.useState<string | null>(
    null,
  );

  const openCount = initialQueue.filter((r) => r.status === "OPEN").length;
  const inProgressCount = initialQueue.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;
  const avgScore =
    initialQueue.length > 0
      ? (
          initialQueue.reduce((acc, r) => acc + r.urgency_score, 0) /
          initialQueue.length
        ).toFixed(1)
      : "0";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-eyebrow mb-2">Priority Queue</p>
        <h1 className="text-display-lg mb-4">Issue Management</h1>
        <p className="text-body-lg ">
          Manage and allocate resources for reported civic issues in your
          jurisdiction.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
          value={initialQueue.length}
          label="Total in Queue"
        />
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          value={openCount}
          label="Open Issues"
          trend={
            openCount > 0
              ? { value: `${inProgressCount} in progress`, positive: true }
              : undefined
          }
        />
        <StatCard
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          }
          value={avgScore}
          label="Avg. Urgency Score"
        />
      </div>

      {/* Queue */}
      {initialQueue.length === 0 ? (
        <EmptyState
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          title="Queue is Empty"
          description="All civic issues in your jurisdiction have been resolved. Great work!"
        />
      ) : (
        <div className="space-y-4">
          {initialQueue.map((report) => (
            <Card
              key={report.id}
              variant="feature"
              className="p-0 overflow-hidden"
              elevation={1}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  {/* Left content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-lg shrink-0">
                        {categoryIcons[report.category] || "📋"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-display-xs truncate">
                          {report.category.replace(/_/g, " ")}
                        </h3>
                        <div className="flex items-center gap-2 text-body-sm text-mute">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {report.latitude.toFixed(4)},{" "}
                          {report.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-sm-strong">
                          Urgency Score
                        </span>
                        <span className="text-body-sm-strong">
                          {report.urgency_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-hairline overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.min(report.urgency_score, 100)}%`,
                            background:
                              report.urgency_score > 70
                                ? "#ee1d36" // accent-red
                                : report.urgency_score > 40
                                  ? "#ffae13" // accent-yellow
                                  : "#00d722", // accent-green
                          }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill variant="neutral">
                        <span className="flex items-center gap-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          {report.report_count} Reports
                        </span>
                      </Pill>
                      {report.sdg_tags.map((tag: string) => (
                        <Pill key={tag} variant={sdgColors[tag] || "neutral"}>
                          SDG {tag}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col gap-3 md:min-w-[200px] md:items-end">
                    <StatusBadge status={report.status} />
                    <div className="flex gap-2 mt-auto">
                      {report.status === "OPEN" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-white"
                          onClick={() =>
                            updateReportStatus(
                              report.id,
                              "IN_PROGRESS" as Status,
                            )
                          }
                        >
                          Start Work
                        </Button>
                      )}
                      {report.status === "IN_PROGRESS" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-white"
                          onClick={() =>
                            updateReportStatus(report.id, "RESOLVED" as Status)
                          }
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setExpandedBudget(
                            expandedBudget === report.id ? null : report.id,
                          )
                        }
                      >
                        💰 Budget
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget form (expandable) */}
              {expandedBudget === report.id && (
                <div className="border-t border-hairline bg-canvas p-6">
                  <form
                    action={allocateBudget}
                    className="flex flex-col sm:flex-row gap-4 items-end"
                  >
                    <input type="hidden" name="reportId" value={report.id} />
                    <div className="flex-1 w-full">
                      <label className="block text-body-sm-strong mb-2">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        placeholder="5000"
                        required
                        className="w-full rounded-sm bg-canvas border border-hairline px-4 py-2 text-body-md text-ink placeholder:text-mute focus:outline-none focus:border-ink hover:border-mute"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-body-sm-strong mb-2">
                        Justification
                      </label>
                      <input
                        type="text"
                        name="justification"
                        placeholder="Emergency repair needed"
                        required
                        className="w-full rounded-sm bg-canvas border border-hairline px-4 py-2 text-body-md text-ink placeholder:text-mute focus:outline-none focus:border-ink hover:border-mute"
                      />
                    </div>
                    <Button
                      variant="primary"
                      type="submit"
                      size="md"
                      className="text-white shrink-0 w-full sm:w-auto"
                    >
                      Approve Funds
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
