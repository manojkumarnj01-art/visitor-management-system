-- ==========================================================================
-- BHARANI HYDRAULICS VMS - STORAGE STORAGE SETUP (storage_setup.sql)
-- Configures the public "visitor-passes" bucket and its storage policies.
-- ==========================================================================

-- 1. Register Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'visitor-passes', 
    'visitor-passes', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Configure Storage Object Policies

-- Enable public select/download of passes and photo uploads
CREATE POLICY "Allow Public Read Access on Passes"
ON storage.objects FOR SELECT
USING (bucket_id = 'visitor-passes');

-- Allow visitors and registration kiosks to upload photos/documents
CREATE POLICY "Allow Public Upload Access on Passes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'visitor-passes');

-- Restrict file updates to authenticated admin/gatekeeper roles
CREATE POLICY "Allow Authenticated Users to Update Passes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'visitor-passes')
WITH CHECK (bucket_id = 'visitor-passes');

-- Restrict file deletions to authenticated admin/gatekeeper roles
CREATE POLICY "Allow Authenticated Users to Delete Passes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'visitor-passes');
