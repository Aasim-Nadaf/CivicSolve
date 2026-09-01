"use server"
import { verifyAuditChain } from "@/lib/audit";
import { getRole } from "./auth";

export async function checkAuditChain() {
  const role = await getRole();
  if (role !== "AUDITOR" && role !== "ADMIN") throw new Error("Unauthorized");

  return await verifyAuditChain();
}
