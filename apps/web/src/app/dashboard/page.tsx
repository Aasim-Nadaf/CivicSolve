import { getRole } from "@/actions/auth";
import CitizenDashboard from "@/components/dashboards/CitizenDashboard";
import OfficerDashboard from "@/components/dashboards/OfficerDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import AuditorDashboard from "@/components/dashboards/AuditorDashboard";
import { prisma } from "db";

export default async function DashboardPage() {
  const role = await getRole();

  try {
    if (role === "CITIZEN") {
      const myReports = await prisma.rawReport.findMany({
        take: 10,
        orderBy: { submitted_at: 'desc' },
        include: { canonical_report: true }
      });
      return <CitizenDashboard initialReports={myReports} />;
    }

    if (role === "OFFICER") {
      const queue = await prisma.canonicalReport.findMany({
        where: { status: { not: "CLOSED" } },
        orderBy: { urgency_score: 'desc' },
        take: 20,
      });
      return <OfficerDashboard initialQueue={queue} />;
    }

    if (role === "ADMIN") {
      const stats = {
        totalReports: await prisma.canonicalReport.count(),
        resolvedReports: await prisma.canonicalReport.count({ where: { status: "RESOLVED" } }),
      };
      return <AdminDashboard stats={stats} />;
    }

    if (role === "AUDITOR") {
      const logs = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50
      });
      return <AuditorDashboard initialLogs={logs} />;
    }

    // Fallback for unknown roles — show citizen dashboard with empty state
    return <CitizenDashboard initialReports={[]} />;
  } catch (error) {
    console.error("Database error:", error);

    // Graceful fallback — render dashboard with empty data
    if (role === "CITIZEN") return <CitizenDashboard initialReports={[]} />;
    if (role === "OFFICER") return <OfficerDashboard initialQueue={[]} />;
    if (role === "ADMIN") return <AdminDashboard stats={{ totalReports: 0, resolvedReports: 0 }} />;
    if (role === "AUDITOR") return <AuditorDashboard initialLogs={[]} />;
    return <CitizenDashboard initialReports={[]} />;
  }
}
