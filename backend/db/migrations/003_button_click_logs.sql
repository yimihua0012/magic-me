-- ============================================
-- Button Click Logs
-- ============================================

CREATE TABLE IF NOT EXISTS button_click_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    button_type TEXT NOT NULL,
    source TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_button_click_logs_clicked_at ON button_click_logs(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_button_click_logs_button_type ON button_click_logs(button_type);
CREATE INDEX IF NOT EXISTS idx_button_click_logs_source ON button_click_logs(source);
CREATE INDEX IF NOT EXISTS idx_button_click_logs_user_id ON button_click_logs(user_id);

ALTER TABLE button_click_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all button click logs"
    ON button_click_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

