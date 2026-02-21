import { getDb } from "./neon";
import type { RoomAssignment } from "./types";

export async function getAssignmentsForToday(hotelId: string) {
  const sql = getDb();
  return sql`
    SELECT * FROM room_assignment
    WHERE hotel_id = ${hotelId} AND assigned_date = CURRENT_DATE
    ORDER BY room_id
  ` as Promise<RoomAssignment[]>;
}

export async function getAssignmentsForHousekeeper(hotelId: string, housekeeperId: string) {
  const sql = getDb();
  return sql`
    SELECT * FROM room_assignment
    WHERE hotel_id = ${hotelId}
      AND housekeeper_id = ${housekeeperId}
      AND assigned_date = CURRENT_DATE
    ORDER BY room_id
  ` as Promise<RoomAssignment[]>;
}

export async function createAssignment(
  hotelId: string,
  roomId: string,
  housekeeperId: string,
  assignedBy: string
) {
  const sql = getDb();
  return sql`
    INSERT INTO room_assignment (hotel_id, room_id, housekeeper_id, assigned_by, assigned_date)
    VALUES (${hotelId}, ${roomId}, ${housekeeperId}, ${assignedBy}, CURRENT_DATE)
    RETURNING *
  ` as Promise<RoomAssignment[]>;
}

export async function updateAssignmentStatus(
  assignmentId: string,
  hotelId: string,
  status: RoomAssignment["status"]
) {
  const sql = getDb();
  return sql`
    UPDATE room_assignment SET status = ${status}
    WHERE id = ${assignmentId} AND hotel_id = ${hotelId}
    RETURNING *
  ` as Promise<RoomAssignment[]>;
}
