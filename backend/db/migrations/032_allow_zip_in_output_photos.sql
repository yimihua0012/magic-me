-- Allow backend photo packages to store ZIP files in the existing output bucket.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/zip']
WHERE id = 'output-photos'
  AND NOT ('application/zip' = ANY(COALESCE(allowed_mime_types, ARRAY[]::text[])));
