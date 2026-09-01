"use server"
import { Category, prisma } from "db";
import { processNewReport } from "@/lib/engine";
import { appendAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { getRole } from "./auth";

export async function submitCitizenReport(formData: FormData) {
  const role = await getRole();
  if (role !== "CITIZEN") throw new Error("Unauthorized");

  const category = formData.get("category") as Category;
  const description = formData.get("description") as string;
  const severityRating = parseInt(formData.get("severity") as string);
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);

  // Fetch Citizen ID since we don't have real auth
  const citizen = await prisma.user.findFirst({ where: { role: "CITIZEN" } });
  if (!citizen) throw new Error("No citizen found in database. Please seed the DB.");
  const citizenId = citizen.id; // In real app, from session
  const result = await processNewReport(
    citizenId,
    category,
    description,
    severityRating,
    latitude,
    longitude
  );

  await appendAuditLog(
    citizenId,
    "CITIZEN",
    "REPORT_SUBMITTED",
    result.canonicalReportId!,
    { category, description, isDuplicate: result.isDuplicate }
  );

  revalidatePath("/");
  return result;
}
