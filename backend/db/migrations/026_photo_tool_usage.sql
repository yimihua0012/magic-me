-- Migration: 026_photo_tool_usage
-- Description: Track per-user metered Photo Tools usage, including one free remove-background run.

BEGIN;

CREATE TABLE IF NOT EXISTS photo_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  free_uses INTEGER NOT NULL DEFAULT 0,
  paid_uses INTEGER NOT NULL DEFAULT 0,
  total_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_photo_tool_usage_user_tool
  ON photo_tool_usage(user_id, tool_id);

ALTER TABLE photo_tool_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own photo tool usage" ON photo_tool_usage;
CREATE POLICY "Users can view their own photo tool usage"
  ON photo_tool_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages photo tool usage" ON photo_tool_usage;
CREATE POLICY "Service role manages photo tool usage"
  ON photo_tool_usage FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

COMMIT;
