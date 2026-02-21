-- 002_business_rules.sql
-- Triggers and constraints enforcing locked HOMS business rules

-- 1. When a room becomes vacant, auto-reset is_cleaned to false
CREATE OR REPLACE FUNCTION reset_clean_when_vacant()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_vacant = true AND OLD.is_vacant IS DISTINCT FROM NEW.is_vacant THEN
    NEW.is_cleaned := false;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_room_vacancy_reset
  BEFORE UPDATE ON room
  FOR EACH ROW
  EXECUTE FUNCTION reset_clean_when_vacant();

-- 2. Block note content updates (notes are immutable once created)
CREATE OR REPLACE FUNCTION prevent_note_content_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    RAISE EXCEPTION 'Notes are immutable: content cannot be edited';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_note_immutable
  BEFORE UPDATE ON note
  FOR EACH ROW
  EXECUTE FUNCTION prevent_note_content_update();

-- 3. Cleaning session: completed_at must be >= started_at
ALTER TABLE cleaning_session
  ADD CONSTRAINT chk_cleaning_times
  CHECK (completed_at IS NULL OR completed_at >= started_at);

-- 4. Maintenance task: closed_at required when status = CLOSED, and vice versa
ALTER TABLE maintenance_task
  ADD CONSTRAINT chk_task_closed_consistency
  CHECK (
    (status = 'CLOSED' AND closed_at IS NOT NULL AND closed_by IS NOT NULL)
    OR
    (status != 'CLOSED' AND closed_at IS NULL)
  );
