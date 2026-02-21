import { getDb } from "./neon";
import type { Room } from "./types";

export async function getRoomsByHotel(hotelId: string) {
  const sql = getDb();
  return sql`
    SELECT * FROM room WHERE hotel_id = ${hotelId} ORDER BY room_number
  ` as Promise<Room[]>;
}

export async function getRoomById(roomId: string, hotelId: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM room WHERE id = ${roomId} AND hotel_id = ${hotelId}
  ` as Room[];
  return rows[0] ?? null;
}

export async function setVacancy(roomId: string, hotelId: string, isVacant: boolean) {
  const sql = getDb();
  return sql`
    UPDATE room SET is_vacant = ${isVacant}
    WHERE id = ${roomId} AND hotel_id = ${hotelId}
    RETURNING *
  ` as Promise<Room[]>;
}

export async function markCleaned(roomId: string, hotelId: string) {
  const sql = getDb();
  return sql`
    UPDATE room SET is_cleaned = true
    WHERE id = ${roomId} AND hotel_id = ${hotelId} AND is_vacant = true
    RETURNING *
  ` as Promise<Room[]>;
}

export async function revertCleaned(roomId: string, hotelId: string) {
  const sql = getDb();
  return sql`
    UPDATE room SET is_cleaned = false
    WHERE id = ${roomId} AND hotel_id = ${hotelId}
    RETURNING *
  ` as Promise<Room[]>;
}
