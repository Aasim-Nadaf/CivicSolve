import { PrismaClient, Role, Category, Status } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import crypto from "crypto";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function createHash(payload: string) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function createSignature(payloadHash: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payloadHash).digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // 1. Create Users
  const citizen1 = await prisma.user.create({
    data: { name: "John Citizen", email: "john@example.com", role: Role.CITIZEN },
  });
  const citizen2 = await prisma.user.create({
    data: { name: "Jane Citizen", email: "jane@example.com", role: Role.CITIZEN },
  });
  const officer1 = await prisma.user.create({
    data: { name: "Officer Bob", email: "bob@city.gov", role: Role.OFFICER, jurisdiction_id: "JUR-001" },
  });
  const admin1 = await prisma.user.create({
    data: { name: "Admin Alice", email: "alice@city.gov", role: Role.ADMIN },
  });
  const auditor1 = await prisma.user.create({
    data: { name: "Auditor Smith", email: "smith@audit.gov", role: Role.AUDITOR },
  });

  console.log("Users created.");

  // 2. Create Canonical Reports
  const report1 = await prisma.canonicalReport.create({
    data: {
      category: Category.POTHOLES,
      urgency_score: 45.5,
      latitude: 40.7128,
      longitude: -74.0060,
      jurisdiction_id: "JUR-001",
      sdg_tags: ["9", "11"],
      status: Status.OPEN,
      report_count: 2,
    },
  });

  const report2 = await prisma.canonicalReport.create({
    data: {
      category: Category.FLOOD,
      urgency_score: 85.0,
      latitude: 40.7130,
      longitude: -74.0070,
      jurisdiction_id: "JUR-001",
      sdg_tags: ["11", "13"],
      status: Status.IN_PROGRESS,
      report_count: 1,
    },
  });

  console.log("Canonical Reports created.");

  // 3. Create Raw Reports
  await prisma.rawReport.create({
    data: {
      canonical_report_id: report1.id,
      citizen_id: citizen1.id,
      description: "Huge pothole on main street",
      severity_rating: 4,
      latitude: 40.7128,
      longitude: -74.0060,
      is_duplicate: false,
    },
  });

  await prisma.rawReport.create({
    data: {
      canonical_report_id: report1.id,
      citizen_id: citizen2.id,
      description: "Car damaging pothole here",
      severity_rating: 3,
      latitude: 40.7129,
      longitude: -74.0061,
      is_duplicate: true,
    },
  });

  await prisma.rawReport.create({
    data: {
      canonical_report_id: report2.id,
      citizen_id: citizen1.id,
      description: "Street is flooded up to the sidewalk",
      severity_rating: 5,
      latitude: 40.7130,
      longitude: -74.0070,
      is_duplicate: false,
    },
  });

  console.log("Raw Reports created.");

  // 4. Create Audit Logs
  const SECRET = "super_secret_audit_key";
  
  const payload1 = JSON.stringify({ action: "REPORT_SUBMITTED", entity_id: report1.id });
  const hash1 = createHash(payload1);
  
  const audit1 = await prisma.auditLog.create({
    data: {
      actor_id: citizen1.id,
      actor_role: citizen1.role,
      action: "REPORT_SUBMITTED",
      entity_id: report1.id,
      payload_hash: hash1,
      previous_log_hash: null, // First block in chain
      signature: createSignature(hash1, SECRET),
    },
  });

  const payload2 = JSON.stringify({ action: "STATUS_UPDATED", entity_id: report2.id, new_status: "IN_PROGRESS" });
  const hash2 = createHash(payload2);
  
  const audit2 = await prisma.auditLog.create({
    data: {
      actor_id: officer1.id,
      actor_role: officer1.role,
      action: "STATUS_UPDATED",
      entity_id: report2.id,
      payload_hash: hash2,
      previous_log_hash: hash1,
      signature: createSignature(hash2, SECRET),
    },
  });

  console.log("Audit Logs created.");

  // 5. Create Budget Allocation
  await prisma.budgetAllocation.create({
    data: {
      canonical_report_id: report2.id,
      officer_id: officer1.id,
      amount: 5000.0,
      justification: "Emergency pump deployment",
      audit_log_id: audit2.id,
    }
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
