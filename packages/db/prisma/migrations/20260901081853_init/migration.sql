-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN', 'AUDITOR');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FLOOD', 'DRAINAGE', 'POTHOLES', 'STREETLIGHTS', 'TREE_PLANTING', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "jurisdiction_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalReport" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "urgency_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "report_count" INTEGER NOT NULL DEFAULT 1,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "jurisdiction_id" TEXT,
    "sdg_tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "CanonicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawReport" (
    "id" TEXT NOT NULL,
    "canonical_report_id" TEXT NOT NULL,
    "citizen_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity_rating" INTEGER NOT NULL DEFAULT 1,
    "photo_url" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RawReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" TEXT NOT NULL,
    "actor_role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "previous_log_hash" TEXT,
    "signature" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetAllocation" (
    "id" TEXT NOT NULL,
    "canonical_report_id" TEXT NOT NULL,
    "officer_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "justification" TEXT NOT NULL,
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audit_log_id" TEXT NOT NULL,

    CONSTRAINT "BudgetAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RawReport" ADD CONSTRAINT "RawReport_canonical_report_id_fkey" FOREIGN KEY ("canonical_report_id") REFERENCES "CanonicalReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawReport" ADD CONSTRAINT "RawReport_citizen_id_fkey" FOREIGN KEY ("citizen_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetAllocation" ADD CONSTRAINT "BudgetAllocation_canonical_report_id_fkey" FOREIGN KEY ("canonical_report_id") REFERENCES "CanonicalReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetAllocation" ADD CONSTRAINT "BudgetAllocation_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
