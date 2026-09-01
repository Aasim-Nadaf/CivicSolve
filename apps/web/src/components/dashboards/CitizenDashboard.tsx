"use client";
import * as React from "react";
import { submitCitizenReport } from "@/actions/report";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

const categoryIcons: Record<string, string> = {
  POTHOLES: "🕳️",
  STREETLIGHTS: "💡",
  TREE_PLANTING: "🌳",
  DRAINAGE: "🚰",
  FLOOD: "🌊",
  OTHER: "📋",
};

export default function CitizenDashboard({
  initialReports,
}: {
  initialReports: any[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<{
    isDuplicate: boolean;
    confidence?: number;
  } | null>(null);
  const [severityValue, setSeverityValue] = React.useState(3);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    try {
      // Mock GPS
      if (!formData.get("latitude")) formData.set("latitude", "40.7128");
      if (!formData.get("longitude")) formData.set("longitude", "-74.0060");

      const res = await submitCitizenReport(formData);
      setSuccess({ isDuplicate: res.isDuplicate, confidence: res.confidence });
      (e.target as HTMLFormElement).reset();
      setSeverityValue(3);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const severityLabels = ["", "Minor", "Low", "Moderate", "High", "Critical"];
  const severityColors = [
    "",
    "text-accent-green",
    "text-accent-green",
    "text-accent-yellow",
    "text-accent-red",
    "text-accent-red",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12">
        <p className="text-eyebrow mb-2">Citizen Portal</p>
        <h1 className="text-display-lg mb-4">Report a Civic Issue</h1>
        <p className="text-body-lg">
          Help improve your city by reporting infrastructure, safety, or
          environmental issues. Our AI deduplication engine ensures your voice
          adds weight to existing problems.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Report Form — spans 3 columns */}
        <div className="lg:col-span-3">
          <Card variant="feature" elevation={2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-lg">
                📝
              </div>
              <div>
                <h2 className="text-display-sm">New Report</h2>
                <p className="text-body-sm text-mute">
                  Fill in the details below
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-body-sm-strong mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    className="w-full rounded-sm bg-canvas border border-hairline px-4 py-3 text-body-md text-ink transition-colors focus:outline-none focus:border-ink hover:border-mute appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23080808' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="POTHOLES">🕳️ Potholes</option>
                    <option value="STREETLIGHTS">💡 Streetlights</option>
                    <option value="TREE_PLANTING">🌳 Tree Planting</option>
                    <option value="DRAINAGE">🚰 Drainage</option>
                    <option value="FLOOD">🌊 Flood-Prone Areas</option>
                    <option value="OTHER">📋 Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-body-sm-strong mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full rounded-sm bg-canvas border border-hairline px-4 py-3 text-body-md text-ink placeholder:text-mute-soft transition-colors focus:outline-none focus:border-ink hover:border-mute resize-none"
                />
              </div>

              {/* Severity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-body-sm-strong">Severity</label>
                  <span
                    className={`text-body-sm-strong ${severityColors[severityValue]}`}
                  >
                    {severityLabels[severityValue]}
                  </span>
                </div>
                <input
                  type="range"
                  name="severity"
                  min="1"
                  max="5"
                  value={severityValue}
                  onChange={(e) => setSeverityValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-hairline rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-caption text-mute">Low</span>
                  <span className="text-caption text-mute">Critical</span>
                </div>
              </div>

              {/* Submit */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full text-white"
                size="lg"
              >
                {loading ? "Analyzing & Submitting..." : "Submit Report"}
              </Button>

              {/* Success feedback */}
              {success && (
                <div className="rounded-sm p-4 border border-hairline bg-canvas mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#080808"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-body-sm-strong text-ink mb-1">
                        Report Submitted Successfully!
                      </p>
                      {success.isDuplicate ? (
                        <p className="text-body-sm text-body-mid">
                          Our AI identified this as related to an existing issue
                          ({(success.confidence! * 100).toFixed(0)}% match).
                          Your report has been merged to increase its priority.
                        </p>
                      ) : (
                        <p className="text-body-sm text-body-mid">
                          A new issue has been created and is now visible to
                          municipal officers.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Recent Reports — spans 2 columns */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-display-sm">Your Reports</h2>
            <Pill variant="neutral">{initialReports.length} total</Pill>
          </div>

          {initialReports.length === 0 ? (
            <EmptyState
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
              title="No Reports Yet"
              description="Submit your first civic issue report to see it here."
            />
          ) : (
            <div className="space-y-4">
              {initialReports.map((report) => (
                <Card
                  key={report.id}
                  variant="feature"
                  className="p-4"
                  elevation={1}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {categoryIcons[report.canonical_report.category] ||
                          "📋"}
                      </span>
                      <Pill variant="neutral">
                        {report.canonical_report.category.replace(/_/g, " ")}
                      </Pill>
                    </div>
                    <span className="text-caption text-mute">
                      {getTimeAgo(report.submitted_at)}
                    </span>
                  </div>

                  <p className="text-body-sm text-body-mid line-clamp-2 mb-4">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={report.canonical_report.status} />
                    {report.is_duplicate && (
                      <span className="text-caption text-accent-purple flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        +{report.canonical_report.report_count - 1} merged
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
