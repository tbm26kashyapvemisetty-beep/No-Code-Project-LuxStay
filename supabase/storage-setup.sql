-- ============================================
-- Supabase Storage Setup for Listing Images
-- ============================================

-- 1. Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies
-- Allow authenticated users to upload images (client-side uploads)
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  auth.uid() IS NOT NULL
);

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Allow users to update their own listing images
CREATE POLICY "Users can update their own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own listing images
CREATE POLICY "Users can delete their own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Note: Images will be stored in the following structure:
-- listing-images/{user_id}/{listing_id}/{filename}
-- This allows for proper access control and organization

