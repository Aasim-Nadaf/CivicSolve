"use client";
import * as React from "react";
import { checkAuditChain } from "@/actions/auditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";

const roleColors: Record<
  string,
  { variant: "info" | "success" | "warning" | "danger" | "neutral" }
> = {
  CITIZEN: { variant: "info" },
  OFFICER: { variant: "warning" },
  ADMIN: { variant: "danger" },
  AUDITOR: { variant: "success" },
};

export default function AuditorDashboard({
  initialLogs,
}: {
  initialLogs: any[];
}) {
  const [verificationResult, setVerificationResult] = React.useState<{
    isValid: boolean;
    corruptedLogs: any[];
  } | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await checkAuditChain();
      setVerificationResult(res);
    } catch (e) {
      console.error(e);
    }
    setVerifying(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
        <div>
          <p className="text-eyebrow mb-2">Cryptographic Audit</p>
          <h1 className="text-display-lg mb-4">Audit Log</h1>
          <p className="text-body-lg">
            Append-only tamper-evident ledger. Every action is cryptographically
            signed and hash-chained.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleVerify}
          disabled={verifying}
          loading={verifying}
          className="shrink-0 text-white"
        >
          {verifying ? "Verifying..." : "Verify Chain Integrity"}
        </Button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="mb-12">
          {verificationResult.isValid ? (
            <Card variant="category-green" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-display-xs text-primary">
                      Chain Verified
                    </h3>
                    <Pill variant="neutral">VALID & UNTAMPERED</Pill>
                  </div>
                  <p className="text-body-sm text-primary">
                    All {initialLogs.length} log entries have been verified. No
                    tampering detected.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="category-pink" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-display-xs text-white">
                      Chain Corrupted
                    </h3>
                    <Pill variant="neutral">INTEGRITY FAILURE</Pill>
                  </div>
                  <p className="text-body-sm text-white/90">
                    Found {verificationResult.corruptedLogs.length} corrupted
                    entries. Investigate immediately.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Log Table */}
      {initialLogs.length === 0 ? (
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          title="No Audit Logs"
          description="No actions have been recorded yet. Logs will appear here as the system is used."
        />
      ) : (
        <Card variant="feature" elevation={1} className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hairline bg-canvas">
                  <th className="px-6 py-4 text-eyebrow-sm text-mute">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-eyebrow-sm text-mute">Actor</th>
                  <th className="px-6 py-4 text-eyebrow-sm text-mute">
                    Action
                  </th>
                  <th className="px-6 py-4 text-eyebrow-sm text-mute">
                    Entity
                  </th>
                  <th className="px-6 py-4 text-eyebrow-sm text-mute">
                    Hash (SHA-256)
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-hairline hover:bg-black/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-body-sm-strong">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-caption text-mute mt-0.5">
                        {getTimeAgo(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Pill
                        variant={
                          roleColors[log.actor_role]?.variant || "neutral"
                        }
                      >
                        {log.actor_role}
                      </Pill>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-body-sm-strong">
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-mono text-caption text-mute max-w-[100px] truncate block cursor-pointer hover:text-ink transition-colors"
                        title={log.entity_id}
                        onClick={() => copyToClipboard(log.entity_id)}
                      >
                        {log.entity_id.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-caption text-accent-purple max-w-[140px] truncate block cursor-pointer hover:text-ink transition-colors"
                          title={log.payload_hash}
                          onClick={() => copyToClipboard(log.payload_hash)}
                        >
                          {log.payload_hash.slice(0, 16)}…
                        </span>
                        <button
                          onClick={() => copyToClipboard(log.payload_hash)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-mute hover:text-ink"
                          title="Copy hash"
                        >
                          {copiedHash === log.payload_hash ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table footer */}
          <div className="px-6 py-4 border-t border-hairline bg-canvas flex items-center justify-between">
            <span className="text-caption text-mute">
              Showing {initialLogs.length} entries
            </span>
            <span className="text-caption text-mute flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              End-to-end hash-chain verified
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
