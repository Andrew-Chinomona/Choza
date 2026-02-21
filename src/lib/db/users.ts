import { getDb } from "./neon";
import type { User } from "./types";

export async function getUserByUsername(username: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM users WHERE username = ${username} AND is_active = true
  ` as User[];
  return rows[0] ?? null;
}

export async function getUserById(userId: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM users WHERE id = ${userId}
  ` as User[];
  return rows[0] ?? null;
}

export async function getStaffByHotel(hotelId: string, includePersonalData = false) {
  const sql = getDb();

  if (includePersonalData) {
    return sql`
      SELECT * FROM users WHERE hotel_id = ${hotelId} ORDER BY full_name
    ` as Promise<User[]>;
  }

  return sql`
    SELECT id, hotel_id, username, role, full_name, is_active, created_at
    FROM users WHERE hotel_id = ${hotelId} ORDER BY full_name
  ` as Promise<Omit<User, "pin_hash" | "personal_data_json">[]>;
}

export async function createUser(
  hotelId: string,
  username: string,
  pinHash: string,
  role: User["role"],
  fullName: string
) {
  const sql = getDb();
  return sql`
    INSERT INTO users (hotel_id, username, pin_hash, role, full_name)
    VALUES (${hotelId}, ${username}, ${pinHash}, ${role}, ${fullName})
    RETURNING id, hotel_id, username, role, full_name, is_active, created_at
  `;
}

export async function deactivateUser(userId: string, hotelId: string) {
  const sql = getDb();
  return sql`
    UPDATE users SET is_active = false
    WHERE id = ${userId} AND hotel_id = ${hotelId}
    RETURNING id, username, is_active
  `;
}
