-- 003_audit_retention.sql
-- Audit log retention cleanup function and soft-delete support indexes

-- Partial index on non-deleted notes for common queries
CREATE INDEX idx_note_active ON note(room_id, created_at) WHERE deleted_at IS NULL;

-- Retention cleanup: deletes audit_log rows older than the given interval
-- Callable from a Vercel Cron endpoint
CREATE OR REPLACE FUNCTION purge_old_audit_logs(retention_interval INTERVAL)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_log
  WHERE created_at < now() - retention_interval;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
