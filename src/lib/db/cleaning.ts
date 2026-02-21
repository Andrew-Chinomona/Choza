import { getDb } from "./neon";
import type { CleaningSession } from "./types";

export async function startCleaning(assignmentId: string, cleanedBy: string) {
  const sql = getDb();
  return sql`
    INSERT INTO cleaning_session (assignment_id, cleaned_by, started_at)
    VALUES (${assignmentId}, ${cleanedBy}, now())
    RETURNING *
  ` as Promise<CleaningSession[]>;
}

export async function completeCleaning(sessionId: string) {
  const sql = getDb();
  return sql`
    UPDATE cleaning_session SET completed_at = now()
    WHERE id = ${sessionId} AND completed_at IS NULL
    RETURNING *
  ` as Promise<CleaningSession[]>;
}

export async function getSessionByAssignment(assignmentId: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM cleaning_session WHERE assignment_id = ${assignmentId}
  ` as CleaningSession[];
  return rows[0] ?? null;
}

export async function getCleaningMetrics(hotelId: string, date: string) {
  const sql = getDb();
  return sql`
    SELECT
      cs.cleaned_by,
      u.full_name,
      COUNT(*)::int AS rooms_cleaned,
      AVG(EXTRACT(EPOCH FROM (cs.completed_at - cs.started_at)))::int AS avg_seconds
    FROM cleaning_session cs
    JOIN room_assignment ra ON ra.id = cs.assignment_id
    JOIN users u ON u.id = cs.cleaned_by
    WHERE ra.hotel_id = ${hotelId}
      AND ra.assigned_date = ${date}
      AND cs.completed_at IS NOT NULL
    GROUP BY cs.cleaned_by, u.full_name
  `;
}
