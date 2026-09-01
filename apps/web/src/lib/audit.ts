import { prisma } from "db";
import crypto from "crypto";

const SECRET = process.env.AUDIT_SECRET || "super_secret_audit_key_123";

function createHash(payload: string) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function createSignature(payloadHash: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payloadHash).digest("hex");
}

export async function appendAuditLog(
  actorId: string,
  actorRole: string,
  action: string,
  entityId: string,
  payload: Record<string, any>
) {
  const payloadStr = JSON.stringify(payload);
  const payloadHash = createHash(payloadStr);

  // Get previous log hash to chain it
  const lastLog = await prisma.auditLog.findFirst({
    orderBy: { timestamp: 'desc' },
    select: { payload_hash: true } // Note: using mapped prisma field or db field, let's stick to prisma schema (payload_hash)
  });

  // Since prisma auto-camelCases, it might be payload_hash or payloadHash depending on schema. 
  // In our schema we didn't use @map, so the field is exactly `payload_hash` in prisma client.
  const previousHash = lastLog ? lastLog.payload_hash : null;

  const signature = createSignature(payloadHash, SECRET);

  const log = await prisma.auditLog.create({
    data: {
      actor_id: actorId,
      actor_role: actorRole,
      action,
      entity_id: entityId,
      payload_hash: payloadHash,
      previous_log_hash: previousHash,
      signature,
    },
  });

  return log;
}

export async function verifyAuditChain() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'asc' },
  });

  let previousHash = null;
  const corruptedLogs = [];

  for (const log of logs) {
    if (log.previous_log_hash !== previousHash) {
      corruptedLogs.push({ log, reason: 'Broken chain link' });
    }

    const expectedSignature = createSignature(log.payload_hash, SECRET);
    if (log.signature !== expectedSignature) {
      corruptedLogs.push({ log, reason: 'Invalid signature' });
    }

    previousHash = log.payload_hash;
  }

  return {
    isValid: corruptedLogs.length === 0,
    corruptedLogs,
  };
}
