export type UserRole =
  | "ADMIN"
  | "MAIN_MANAGER"
  | "OPS_MANAGEMENT"
  | "HOUSEKEEPER"
  | "MAINTENANCE";

export type AssignmentStatus = "ASSIGNED" | "STARTED" | "CLEANED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Hotel {
  id: string;
  name: string;
  created_at: string;
}

export interface User {
  id: string;
  hotel_id: string;
  username: string;
  pin_hash: string;
  role: UserRole;
  full_name: string;
  is_active: boolean;
  personal_data_json: Record<string, unknown> | null;
  created_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  room_type: string | null;
  is_vacant: boolean;
  is_cleaned: boolean;
  updated_at: string;
}

export interface RoomAssignment {
  id: string;
  hotel_id: string;
  room_id: string;
  housekeeper_id: string;
  assigned_by: string;
  assigned_date: string;
  status: AssignmentStatus;
}

export interface CleaningSession {
  id: string;
  assignment_id: string;
  started_at: string;
  completed_at: string | null;
  cleaned_by: string;
}

export interface Note {
  id: string;
  hotel_id: string;
  room_id: string;
  created_by: string;
  content: string;
  created_at: string;
  deleted_at: string | null;
}

export interface MaintenanceTask {
  id: string;
  hotel_id: string;
  room_id: string;
  priority: TaskPriority;
  status: TaskStatus;
  description: string | null;
  created_by: string;
  assigned_to: string | null;
  closed_by: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface AuditLog {
  id: string;
  hotel_id: string;
  actor_user_id: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
