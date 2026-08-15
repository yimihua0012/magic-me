-- 每个样式一张"模板图"（成品示例），用于风格选择时所见即所得。
-- 独立于 headshot_styles，可统一覆盖 DB 样式与前端 JS 兜底样式（photo_tool 等）。
CREATE TABLE IF NOT EXISTS style_templates (
  style_id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_style_templates_updated_at ON style_templates (updated_at DESC);