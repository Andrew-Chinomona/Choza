import { getDb } from "./neon";
import type { MaintenanceTask, TaskPriority, TaskStatus } from "./types";

export async function getTasksByHotel(hotelId: string) {
  const sql = getDb();
  return sql`
    SELECT * FROM maintenance_task
    WHERE hotel_id = ${hotelId}
    ORDER BY
      CASE priority
        WHEN 'EMERGENCY' THEN 0
        WHEN 'HIGH' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 3
      END,
      created_at DESC
  ` as Promise<MaintenanceTask[]>;
}

export async function getTaskById(taskId: string, hotelId: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM maintenance_task WHERE id = ${taskId} AND hotel_id = ${hotelId}
  ` as MaintenanceTask[];
  return rows[0] ?? null;
}

export async function createTask(
  hotelId: string,
  roomId: string,
  createdBy: string,
  priority: TaskPriority,
  description?: string
) {
  const sql = getDb();
  return sql`
    INSERT INTO maintenance_task (hotel_id, room_id, created_by, priority, description)
    VALUES (${hotelId}, ${roomId}, ${createdBy}, ${priority}, ${description ?? null})
    RETURNING *
  ` as Promise<MaintenanceTask[]>;
}

export async function updateTaskStatus(
  taskId: string,
  hotelId: string,
  status: TaskStatus,
  closedBy?: string
) {
  const sql = getDb();

  if (status === "CLOSED" && closedBy) {
    return sql`
      UPDATE maintenance_task
      SET status = ${status}, closed_by = ${closedBy}, closed_at = now()
      WHERE id = ${taskId} AND hotel_id = ${hotelId}
      RETURNING *
    ` as Promise<MaintenanceTask[]>;
  }

  return sql`
    UPDATE maintenance_task
    SET status = ${status}
    WHERE id = ${taskId} AND hotel_id = ${hotelId}
    RETURNING *
  ` as Promise<MaintenanceTask[]>;
}
