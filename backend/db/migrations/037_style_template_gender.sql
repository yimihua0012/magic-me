-- 模板图按性别区分：同一风格可有 neutral/male/female 三个模板。
-- 主键从 style_id 改为复合 (style_id, gender)，既有数据全部归为 neutral。
BEGIN;

ALTER TABLE style_templates
  ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'neutral';

ALTER TABLE style_templates
  DROP CONSTRAINT IF EXISTS style_templates_pkey;

ALTER TABLE style_templates
  ADD CONSTRAINT style_templates_pkey PRIMARY KEY (style_id, gender);

ALTER TABLE style_templates
  ALTER COLUMN gender SET DEFAULT 'neutral';

COMMIT;