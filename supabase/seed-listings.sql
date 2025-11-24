-- Seed data for luxury listings
-- Run this in your Supabase SQL Editor after running schema.sql

-- First, ensure profiles exist (replace emails with actual user emails from your auth.users table)
-- You'll need to replace these IDs with actual user IDs from your Supabase Auth dashboard

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Find the UUID for users with emails containing 'kashyap' and 'aneesh'
-- 3. Replace the UUIDs below with the actual UUIDs

-- For this example, I'll use placeholder UUIDs. You need to replace them!
-- Get actual user IDs by running: SELECT id, email FROM auth.users;

-- Assuming you have users, let's insert listings
-- Replace '00000000-0000-0000-0000-000000000001' with Kashyap's actual user ID
-- Replace '00000000-0000-0000-0000-000000000002' with Aneesh's actual user ID

-- ============================================
-- KASHYAP'S LUXURY LISTINGS
-- ============================================

-- Listing 1: Ocean Villa
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  (SELECT id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1),
  'Luxury villa by the Ocean',
  'Amazing luxury villa 200m from the ocean. This stunning beachfront property offers breathtaking sunset views, infinity pool, and direct beach access. Perfect for families or groups seeking the ultimate coastal retreat with modern amenities and elegant design.',
  500,
  6,
  1,
  4,
  'Goa',
  'India',
  '123 beach road',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', true),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', false),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', false);

-- Listing 2: Mountain Retreat
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'a2222222-2222-2222-2222-222222222222',
  (SELECT id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1),
  'Serene Mountain Retreat',
  'Escape to this luxurious mountain hideaway featuring panoramic valley views, private hiking trails, and a cozy fireplace. This eco-friendly property combines rustic charm with modern luxury amenities including a hot tub, sauna, and gourmet kitchen.',
  750,
  8,
  4,
  3,
  'Manali',
  'India',
  '456 Mountain View Drive',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200', true),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', false),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', false);

-- Listing 3: City Penthouse
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'a3333333-3333-3333-3333-333333333333',
  (SELECT id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1),
  'Luxury Penthouse with City Views',
  'Experience urban luxury at its finest in this stunning penthouse. Floor-to-ceiling windows offer breathtaking city skyline views. Features include a rooftop terrace, infinity pool, smart home technology, and concierge service.',
  1200,
  4,
  3,
  3,
  'Mumbai',
  'India',
  '789 Skyline Tower, Marine Drive',
  false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', true),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', false);

-- Listing 4: Lake House
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'a4444444-4444-4444-4444-444444444444',
  (SELECT id FROM profiles WHERE full_name ILIKE '%kashyap%' LIMIT 1),
  'Tranquil Lakeside Villa',
  'Peaceful lakefront property with private dock, kayaks, and paddle boards included. Wake up to misty mornings and enjoy stunning sunsets over the water. Perfect for nature lovers and water sports enthusiasts.',
  650,
  7,
  3,
  2,
  'Nainital',
  'India',
  '321 Lakeshore Lane',
  false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', true),
('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', false);

-- ============================================
-- ANEESH'S LUXURY LISTINGS
-- ============================================

-- Listing 5: Beach House Paradise
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'b1111111-1111-1111-1111-111111111111',
  (SELECT id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1),
  'Tropical Beach House Paradise',
  'Your private slice of paradise! This beachfront estate features direct beach access, outdoor kitchen, infinity pool, and tropical gardens. Watch dolphins from your balcony and enjoy world-class snorkeling right at your doorstep.',
  900,
  10,
  5,
  4,
  'Malibu',
  'United States',
  '123 Pacific Coast Highway',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200', true),
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', false),
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', false);

-- Listing 6: Desert Oasis
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  (SELECT id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1),
  'Modern Desert Oasis',
  'Architectural masterpiece nestled in the desert landscape. Features minimalist design, heated infinity pool, outdoor fire pit, and stargazing deck. Experience tranquility and luxury in this unique contemporary retreat.',
  850,
  6,
  3,
  3,
  'Palm Springs',
  'United States',
  '456 Desert Vista Road',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200', true),
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', false);

-- Listing 7: Countryside Manor
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'b3333333-3333-3333-3333-333333333333',
  (SELECT id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1),
  'Historic Countryside Manor',
  'Elegant restored manor house with sprawling gardens, tennis court, and wine cellar. Blend of historic charm and modern amenities. Perfect for weddings, family reunions, or a peaceful countryside escape.',
  1100,
  12,
  6,
  5,
  'Tuscany',
  'Italy',
  '789 Via della Campagna',
  false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', true),
('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200', false);

-- Listing 8: Ski Chalet
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'b4444444-4444-4444-4444-444444444444',
  (SELECT id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1),
  'Luxury Alpine Ski Chalet',
  'Ski-in/ski-out luxury chalet with stunning mountain views. Features heated floors, spa, sauna, and professional kitchen. After a day on the slopes, relax by the fireplace with panoramic alpine vistas.',
  1500,
  8,
  4,
  4,
  'Aspen',
  'United States',
  '234 Snowmass Drive',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', true),
('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200', false);

-- Listing 9: Island Villa
INSERT INTO listings (id, owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
  'b5555555-5555-5555-5555-555555555555',
  (SELECT id FROM profiles WHERE full_name ILIKE '%aneesh%' LIMIT 1),
  'Private Island Villa',
  'Ultimate privacy on your own private island! This exclusive villa offers 360-degree ocean views, personal chef service, infinity pool, and water sports equipment. Accessible by private boat. The ultimate luxury escape.',
  2500,
  8,
  4,
  4,
  'Maldives',
  'Maldives',
  'Private Island, North Male Atoll',
  true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) VALUES
('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', true),
('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', false),
('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200', false);

-- Add some amenities to listings
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'a1111111-1111-1111-1111-111111111111', id FROM amenities WHERE name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'Air Conditioning');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'a2222222-2222-2222-2222-222222222222', id FROM amenities WHERE name IN ('WiFi', 'Hot Tub', 'Mountain View', 'Fireplace', 'Heating');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'a3333333-3333-3333-3333-333333333333', id FROM amenities WHERE name IN ('WiFi', 'Pool', 'Gym', 'Air Conditioning', 'Workspace');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'a4444444-4444-4444-4444-444444444444', id FROM amenities WHERE name IN ('WiFi', 'Kitchen', 'Workspace', 'Garden');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'b1111111-1111-1111-1111-111111111111', id FROM amenities WHERE name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'BBQ Grill', 'Kitchen');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'b2222222-2222-2222-2222-222222222222', id FROM amenities WHERE name IN ('WiFi', 'Pool', 'Hot Tub', 'Air Conditioning', 'Workspace');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'b3333333-3333-3333-3333-333333333333', id FROM amenities WHERE name IN ('WiFi', 'Kitchen', 'Garden', 'Workspace', 'Pet Friendly');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'b4444444-4444-4444-4444-444444444444', id FROM amenities WHERE name IN ('WiFi', 'Hot Tub', 'Fireplace', 'Heating', 'Mountain View');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 'b5555555-5555-5555-5555-555555555555', id FROM amenities WHERE name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'Kitchen', 'Hot Tub');

-- Success message
SELECT 'Sample listings created successfully!' as message;
SELECT COUNT(*) as total_listings FROM listings;

