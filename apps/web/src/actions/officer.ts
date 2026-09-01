"use server"
import { Status, prisma } from "db";
import { appendAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { getRole } from "./auth";

export async function updateReportStatus(reportId: string, status: Status) {
  const role = await getRole();
  if (role !== "OFFICER" && role !== "ADMIN") throw new Error("Unauthorized");

  const officerId = "mock-officer-id-001"; // Mock auth

  await prisma.canonicalReport.update({
    where: { id: reportId },
    data: { 
      status,
      resolved_at: status === "RESOLVED" ? new Date() : null 
    }
  });

  await appendAuditLog(
    officerId,
    role,
    "STATUS_UPDATED",
    reportId,
    { newStatus: status }
  );

  revalidatePath("/");
}

export async function allocateBudget(formData: FormData) {
  const role = await getRole();
  if (role !== "OFFICER" && role !== "ADMIN") throw new Error("Unauthorized");

  const officerId = "mock-officer-id-001";
  const reportId = formData.get("reportId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const justification = formData.get("justification") as string;

  const log = await appendAuditLog(
    officerId,
    role,
    "BUDGET_ALLOCATED",
    reportId,
    { amount, justification }
  );

  await prisma.budgetAllocation.create({
    data: {
      canonical_report_id: reportId,
      officer_id: officerId,
      amount,
      justification,
      audit_log_id: log.id,
    }
  });

  revalidatePath("/");
}
