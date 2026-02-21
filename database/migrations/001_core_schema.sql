-- 001_core_schema.sql
-- Core enums, tables, foreign keys, and indexes for HOMS

-- Enums
CREATE TYPE user_role AS ENUM (
  'ADMIN',
  'MAIN_MANAGER',
  'OPS_MANAGEMENT',
  'HOUSEKEEPER',
  'MAINTENANCE'
);

CREATE TYPE assignment_status AS ENUM (
  'ASSIGNED',
  'STARTED',
  'CLEANED'
);

CREATE TYPE task_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'EMERGENCY'
);

CREATE TYPE task_status AS ENUM (
  'OPEN',
  'IN_PROGRESS',
  'CLOSED'
);

-- Hotel
CREATE TABLE hotel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (plural to avoid PG reserved word)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  personal_data_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_hotel ON users(hotel_id);
CREATE INDEX idx_users_role ON users(hotel_id, role);
CREATE INDEX idx_users_active ON users(hotel_id, is_active);

-- Room
CREATE TABLE room (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  room_type TEXT,
  is_vacant BOOLEAN NOT NULL DEFAULT true,
  is_cleaned BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_room_number UNIQUE (hotel_id, room_number)
);

CREATE INDEX idx_room_hotel ON room(hotel_id);
CREATE INDEX idx_room_status ON room(hotel_id, is_vacant, is_cleaned);

-- Room Assignment (daily)
CREATE TABLE room_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES room(id) ON DELETE CASCADE,
  housekeeper_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  status assignment_status NOT NULL DEFAULT 'ASSIGNED'
);

CREATE INDEX idx_assignment_hotel_date ON room_assignment(hotel_id, assigned_date);
CREATE INDEX idx_assignment_housekeeper ON room_assignment(housekeeper_id, assigned_date);
CREATE INDEX idx_assignment_room_date ON room_assignment(room_id, assigned_date);

-- Cleaning Session
CREATE TABLE cleaning_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES room_assignment(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  cleaned_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_cleaning_assignment ON cleaning_session(assignment_id);

-- Note (room timeline)
CREATE TABLE note (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES room(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_note_room ON note(room_id, created_at);
CREATE INDEX idx_note_hotel ON note(hotel_id);

-- Maintenance Task
CREATE TABLE maintenance_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES room(id) ON DELETE CASCADE,
  priority task_priority NOT NULL DEFAULT 'MEDIUM',
  status task_status NOT NULL DEFAULT 'OPEN',
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  closed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_task_hotel ON maintenance_task(hotel_id);
CREATE INDEX idx_task_status ON maintenance_task(hotel_id, status);
CREATE INDEX idx_task_priority ON maintenance_task(hotel_id, priority);
CREATE INDEX idx_task_room ON maintenance_task(room_id);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_hotel ON audit_log(hotel_id, created_at);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);

-- Push Subscription (PWA)
CREATE TABLE push_subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotel(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_user ON push_subscription(user_id);
CREATE INDEX idx_push_hotel ON push_subscription(hotel_id);
