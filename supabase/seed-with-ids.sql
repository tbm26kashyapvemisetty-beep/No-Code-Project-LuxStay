-- Seed data with actual user IDs
-- Aneesh: c9950238-5a40-4101-8c6e-6c47cfe7e929
-- Kashyap: dab4c10e-4ecc-4ed8-9964-b345c45ed61b

-- ============================================
-- KASHYAP'S LUXURY LISTINGS
-- ============================================

-- Listing 1: Ocean Villa
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'dab4c10e-4ecc-4ed8-9964-b345c45ed61b',
    'Luxury villa by the Ocean',
    'Amazing luxury villa 200m from the ocean. This stunning beachfront property offers breathtaking sunset views, infinity pool, and direct beach access. Perfect for families or groups seeking the ultimate coastal retreat with modern amenities and elegant design.',
    500, 6, 1, 4, 'Goa', 'India', '123 beach road', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', true 
FROM listings WHERE title = 'Luxury villa by the Ocean' AND owner_id = 'dab4c10e-4ecc-4ed8-9964-b345c45ed61b' LIMIT 1;

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', false 
FROM listings WHERE title = 'Luxury villa by the Ocean' AND owner_id = 'dab4c10e-4ecc-4ed8-9964-b345c45ed61b' LIMIT 1;

-- Listing 2: Mountain Retreat
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'dab4c10e-4ecc-4ed8-9964-b345c45ed61b',
    'Serene Mountain Retreat',
    'Escape to this luxurious mountain hideaway featuring panoramic valley views, private hiking trails, and a cozy fireplace. This eco-friendly property combines rustic charm with modern luxury amenities including a hot tub, sauna, and gourmet kitchen.',
    750, 8, 4, 3, 'Manali', 'India', '456 Mountain View Drive', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200', true 
FROM listings WHERE title = 'Serene Mountain Retreat' LIMIT 1;

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', false 
FROM listings WHERE title = 'Serene Mountain Retreat' LIMIT 1;

-- Listing 3: City Penthouse
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'dab4c10e-4ecc-4ed8-9964-b345c45ed61b',
    'Luxury Penthouse with City Views',
    'Experience urban luxury at its finest in this stunning penthouse. Floor-to-ceiling windows offer breathtaking city skyline views. Features include a rooftop terrace, infinity pool, smart home technology, and concierge service.',
    1200, 4, 3, 3, 'Mumbai', 'India', '789 Skyline Tower, Marine Drive', false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', true 
FROM listings WHERE title = 'Luxury Penthouse with City Views' LIMIT 1;

-- Listing 4: Lake House
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'dab4c10e-4ecc-4ed8-9964-b345c45ed61b',
    'Tranquil Lakeside Villa',
    'Peaceful lakefront property with private dock, kayaks, and paddle boards included. Wake up to misty mornings and enjoy stunning sunsets over the water. Perfect for nature lovers and water sports enthusiasts.',
    650, 7, 3, 2, 'Nainital', 'India', '321 Lakeshore Lane', false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', true 
FROM listings WHERE title = 'Tranquil Lakeside Villa' LIMIT 1;

-- ============================================
-- ANEESH'S LUXURY LISTINGS
-- ============================================

-- Listing 5: Beach House Paradise
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'c9950238-5a40-4101-8c6e-6c47cfe7e929',
    'Tropical Beach House Paradise',
    'Your private slice of paradise! This beachfront estate features direct beach access, outdoor kitchen, infinity pool, and tropical gardens. Watch dolphins from your balcony and enjoy world-class snorkeling right at your doorstep.',
    900, 10, 5, 4, 'Malibu', 'United States', '123 Pacific Coast Highway', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200', true 
FROM listings WHERE title = 'Tropical Beach House Paradise' LIMIT 1;

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', false 
FROM listings WHERE title = 'Tropical Beach House Paradise' LIMIT 1;

-- Listing 6: Desert Oasis
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'c9950238-5a40-4101-8c6e-6c47cfe7e929',
    'Modern Desert Oasis',
    'Architectural masterpiece nestled in the desert landscape. Features minimalist design, heated infinity pool, outdoor fire pit, and stargazing deck. Experience tranquility and luxury in this unique contemporary retreat.',
    850, 6, 3, 3, 'Palm Springs', 'United States', '456 Desert Vista Road', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200', true 
FROM listings WHERE title = 'Modern Desert Oasis' LIMIT 1;

-- Listing 7: Countryside Manor
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'c9950238-5a40-4101-8c6e-6c47cfe7e929',
    'Historic Countryside Manor',
    'Elegant restored manor house with sprawling gardens, tennis court, and wine cellar. Blend of historic charm and modern amenities. Perfect for weddings, family reunions, or a peaceful countryside escape.',
    1100, 12, 6, 5, 'Tuscany', 'Italy', '789 Via della Campagna', false
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', true 
FROM listings WHERE title = 'Historic Countryside Manor' LIMIT 1;

-- Listing 8: Ski Chalet
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'c9950238-5a40-4101-8c6e-6c47cfe7e929',
    'Luxury Alpine Ski Chalet',
    'Ski-in/ski-out luxury chalet with stunning mountain views. Features heated floors, spa, sauna, and professional kitchen. After a day on the slopes, relax by the fireplace with panoramic alpine vistas.',
    1500, 8, 4, 4, 'Aspen', 'United States', '234 Snowmass Drive', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200', true 
FROM listings WHERE title = 'Luxury Alpine Ski Chalet' LIMIT 1;

-- Listing 9: Island Villa
INSERT INTO listings (owner_id, title, description, nightly_price, max_guests, bedrooms, bathrooms, city, country, address_line1, featured)
VALUES (
    'c9950238-5a40-4101-8c6e-6c47cfe7e929',
    'Private Island Villa',
    'Ultimate privacy on your own private island! This exclusive villa offers 360-degree ocean views, personal chef service, infinity pool, and water sports equipment. Accessible by private boat. The ultimate luxury escape.',
    2500, 8, 4, 4, 'Maldives', 'Maldives', 'Private Island, North Male Atoll', true
);

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', true 
FROM listings WHERE title = 'Private Island Villa' LIMIT 1;

INSERT INTO listing_images (listing_id, image_url, is_cover) 
SELECT id, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', false 
FROM listings WHERE title = 'Private Island Villa' LIMIT 1;

-- Add amenities to listings
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Luxury villa by the Ocean' AND a.name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'Air Conditioning');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Serene Mountain Retreat' AND a.name IN ('WiFi', 'Hot Tub', 'Mountain View', 'Fireplace', 'Heating');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Luxury Penthouse with City Views' AND a.name IN ('WiFi', 'Pool', 'Gym', 'Air Conditioning', 'Workspace');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Tranquil Lakeside Villa' AND a.name IN ('WiFi', 'Kitchen', 'Workspace', 'Garden');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Tropical Beach House Paradise' AND a.name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'BBQ Grill', 'Kitchen');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Modern Desert Oasis' AND a.name IN ('WiFi', 'Pool', 'Hot Tub', 'Air Conditioning', 'Workspace');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Historic Countryside Manor' AND a.name IN ('WiFi', 'Kitchen', 'Garden', 'Workspace', 'Pet Friendly');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Luxury Alpine Ski Chalet' AND a.name IN ('WiFi', 'Hot Tub', 'Fireplace', 'Heating', 'Mountain View');

INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT l.id, a.id FROM listings l, amenities a 
WHERE l.title = 'Private Island Villa' AND a.name IN ('WiFi', 'Pool', 'Beach Access', 'Ocean View', 'Kitchen', 'Hot Tub');

-- Show summary
SELECT 
    'Success! Created listings:' as status;

SELECT 
    p.full_name as host_name,
    COUNT(l.id) as total_listings,
    SUM(CASE WHEN l.featured THEN 1 ELSE 0 END) as featured_listings,
    MIN(l.nightly_price) as min_price,
    MAX(l.nightly_price) as max_price
FROM profiles p
LEFT JOIN listings l ON p.id = l.owner_id
WHERE p.id IN ('c9950238-5a40-4101-8c6e-6c47cfe7e929', 'dab4c10e-4ecc-4ed8-9964-b345c45ed61b')
GROUP BY p.full_name, p.id
ORDER BY p.full_name;

