import { getDb } from "./neon";
import type { AuditLog } from "./types";

export async function logAction(
  hotelId: string,
  actorUserId: string,
  actionType: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>
) {
  const sql = getDb();
  return sql`
    INSERT INTO audit_log (hotel_id, actor_user_id, action_type, entity_type, entity_id, metadata)
    VALUES (${hotelId}, ${actorUserId}, ${actionType}, ${entityType}, ${entityId}, ${JSON.stringify(metadata ?? {})})
    RETURNING *
  ` as Promise<AuditLog[]>;
}

export async function getAuditLogs(hotelId: string, limit = 100) {
  const sql = getDb();
  return sql`
    SELECT * FROM audit_log
    WHERE hotel_id = ${hotelId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as Promise<AuditLog[]>;
}

export async function purgeOldLogs(retentionDays: number) {
  const sql = getDb();
  return sql`SELECT purge_old_audit_logs(${retentionDays + ' days'} ::interval) AS deleted_count`;
}
