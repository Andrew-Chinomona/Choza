"use server";

import { rooms } from "@/lib/db";

const MVP_HOTEL_ID = "a0000000-0000-0000-0000-000000000001";

export async function getRooms() {
  return rooms.getRoomsByHotel(MVP_HOTEL_ID);
}