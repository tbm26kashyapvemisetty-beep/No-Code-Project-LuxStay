-- Automatic seed data for luxury listings
-- This script automatically finds users named 'kashyap' and 'aneesh'
-- Run this in your Supabase SQL Editor

-- First, let's see what users we have
DO $$
DECLARE
    kashyap_id UUID;
    aneesh_id UUID;
BEGIN
    -- Get Kashyap's ID
    SELECT id INTO kashyap_id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1;
    
    -- Get Aneesh's ID  
    SELECT id INTO aneesh_id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1;
    
    -- Check if users exist
    IF kashyap_id IS NULL THEN
        RAISE NOTICE 'No user found with name containing "kashyap". Please create a profile first.';
        RETURN;
    END IF;
    
    IF aneesh_id IS NULL THEN
        RAISE NOTICE 'No user found with name containing "aneesh". Please create a profile first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found Kashyap ID: %', kashyap_id;
    RAISE NOTICE 'Found Aneesh ID: %', aneesh_id;
    
    -- ============================================
    -- KASHYAP'S LUXURY LISTINGS
    -- ============================================
    
    -- Listing 1: Ocean Villa (already exists based on your screenshot)
    INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
    VALUES (
        kashyap_id,
        'Luxury villa by the Ocean',
        'Amazing luxury villa 200m from the ocean. This stunning beachfront property offers breathtaking sunset views, infinity pool, and direct beach access.',
        500, 6, 1, 4, 'Goa', 'India', '123 beach road', true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO kashyap_id; -- Reuse variable for listing ID
    
    -- Add images if listing was created
    IF FOUND THEN
        INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
        (kashyap_id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', true),
        (kashyap_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', false);
    END IF;
    
    -- Get kashyap_id again
    SELECT id INTO kashyap_id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1;
    
    -- More listings for Kashyap
    INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
    VALUES 
    (kashyap_id, 'Serene Mountain Retreat', 'Escape to this luxurious mountain hideaway with panoramic valley views and private hiking trails.', 750, 8, 4, 3, 'Manali', 'India', '456 Mountain View Drive', true),
    (kashyap_id, 'Luxury Penthouse with City Views', 'Experience urban luxury in this stunning penthouse with floor-to-ceiling windows and city skyline views.', 1200, 4, 3, 3, 'Mumbai', 'India', '789 Skyline Tower', false),
    (kashyap_id, 'Tranquil Lakeside Villa', 'Peaceful lakefront property with private dock, kayaks, and paddle boards included.', 650, 7, 3, 2, 'Nainital', 'India', '321 Lakeshore Lane', false);
    
    -- ============================================
    -- ANEESH'S LUXURY LISTINGS
    -- ============================================
    
    INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
    VALUES 
    (aneesh_id, 'Tropical Beach House Paradise', 'Your private slice of paradise with direct beach access, infinity pool, and tropical gardens.', 900, 10, 5, 4, 'Malibu', 'United States', '123 Pacific Coast Highway', true),
    (aneesh_id, 'Modern Desert Oasis', 'Architectural masterpiece in the desert with minimalist design and heated infinity pool.', 850, 6, 3, 3, 'Palm Springs', 'United States', '456 Desert Vista Road', true),
    (aneesh_id, 'Historic Countryside Manor', 'Elegant restored manor house with sprawling gardens, tennis court, and wine cellar.', 1100, 12, 6, 5, 'Tuscany', 'Italy', '789 Via della Campagna', false),
    (aneesh_id, 'Luxury Alpine Ski Chalet', 'Ski-in/ski-out luxury chalet with heated floors, spa, and stunning mountain views.', 1500, 8, 4, 4, 'Aspen', 'United States', '234 Snowmass Drive', true),
    (aneesh_id, 'Private Island Villa', 'Ultimate privacy on your own private island with personal chef service and water sports.', 2500, 8, 4, 4, 'Maldives', 'Maldives', 'Private Island', true);
    
    RAISE NOTICE 'Listings created successfully!';
END $$;

-- Add images for the new listings
WITH new_listings AS (
    SELECT id, title FROM listings 
    WHERE created_at > NOW() - INTERVAL '1 minute'
    ORDER BY created_at DESC
)
INSERT INTO listing_images (listing_id, image_url, is_cover)
SELECT id, 
    CASE title
        WHEN 'Serene Mountain Retreat' THEN 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200'
        WHEN 'Luxury Penthouse with City Views' THEN 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'
        WHEN 'Tranquil Lakeside Villa' THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
        WHEN 'Tropical Beach House Paradise' THEN 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200'
        WHEN 'Modern Desert Oasis' THEN 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200'
        WHEN 'Historic Countryside Manor' THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'
        WHEN 'Luxury Alpine Ski Chalet' THEN 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'
        WHEN 'Private Island Villa' THEN 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200'
    END,
    true
FROM new_listings
WHERE title IN ('Serene Mountain Retreat', 'Luxury Penthouse with City Views', 'Tranquil Lakeside Villa', 
                'Tropical Beach House Paradise', 'Modern Desert Oasis', 'Historic Countryside Manor',
                'Luxury Alpine Ski Chalet', 'Private Island Villa');

-- Show summary
SELECT 
    p.full_name as host,
    COUNT(l.id) as total_listings,
    SUM(CASE WHEN l.featured THEN 1 ELSE 0 END) as featured_listings
FROM profiles p
LEFT JOIN listings l ON p.id = l.owner_id
WHERE p.full_name ILIKE '%kashyap%' OR p.full_name ILIKE '%aneesh%'
GROUP BY p.full_name;

