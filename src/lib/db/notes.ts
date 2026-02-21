import { getDb } from "./neon";
import type { Note } from "./types";

export async function getNotesByRoom(roomId: string, hotelId: string) {
  const sql = getDb();
  return sql`
    SELECT * FROM note
    WHERE room_id = ${roomId} AND hotel_id = ${hotelId} AND deleted_at IS NULL
    ORDER BY created_at DESC
  ` as Promise<Note[]>;
}

export async function createNote(
  hotelId: string,
  roomId: string,
  createdBy: string,
  content: string
) {
  const sql = getDb();
  return sql`
    INSERT INTO note (hotel_id, room_id, created_by, content)
    VALUES (${hotelId}, ${roomId}, ${createdBy}, ${content})
    RETURNING *
  ` as Promise<Note[]>;
}

export async function softDeleteNote(noteId: string, hotelId: string) {
  const sql = getDb();
  return sql`
    UPDATE note SET deleted_at = now()
    WHERE id = ${noteId} AND hotel_id = ${hotelId} AND deleted_at IS NULL
    RETURNING *
  ` as Promise<Note[]>;
}
