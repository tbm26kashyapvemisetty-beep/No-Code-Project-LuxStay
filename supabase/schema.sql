-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'lister', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    nightly_price NUMERIC(10, 2) NOT NULL CHECK (nightly_price > 0),
    max_guests INTEGER NOT NULL CHECK (max_guests > 0),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create listing_amenities junction table
CREATE TABLE IF NOT EXISTS listing_amenities (
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, amenity_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (check_out > check_in)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (guest_id, listing_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(featured);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_is_cover ON listing_images(is_cover);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_out ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_guest_id ON favorites(guest_id);

-- Function to check booking overlap
CREATE OR REPLACE FUNCTION check_booking_overlap(
    p_listing_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO overlap_count
    FROM bookings
    WHERE listing_id = p_listing_id
        AND status IN ('pending', 'confirmed')
        AND (p_booking_id IS NULL OR id != p_booking_id)
        AND NOT (p_check_out <= check_in OR p_check_in >= check_out);
    
    RETURN overlap_count > 0;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for listings updated_at
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Listings are viewable by everyone"
    ON listings FOR SELECT
    USING (true);

CREATE POLICY "Listers can insert their own listings"
    ON listings FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('lister', 'admin'))
    );

CREATE POLICY "Owners can update their own listings"
    ON listings FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings"
    ON listings FOR DELETE
    USING (auth.uid() = owner_id);

-- Listing images policies
CREATE POLICY "Listing images are viewable by everyone"
    ON listing_images FOR SELECT
    USING (true);

CREATE POLICY "Listing owners can manage images"
    ON listing_images FOR ALL
    USING (
        EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    );

-- Amenities policies (public read, admin write)
CREATE POLICY "Amenities are viewable by everyone"
    ON amenities FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage amenities"
    ON amenities FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Listing amenities policies
CREATE POLICY "Listing amenities are viewable by everyone"
    ON listing_amenities FOR SELECT
    USING (true);

CREATE POLICY "Listing owners can manage their listing amenities"
    ON listing_amenities FOR ALL
    USING (
        EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    );

-- Bookings policies
CREATE POLICY "Guests can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = guest_id);

CREATE POLICY "Listers can view bookings for their listings"
    ON bookings FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    );

CREATE POLICY "Guests can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (
        auth.uid() = guest_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('guest', 'admin'))
    );

CREATE POLICY "Guests can cancel their own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = guest_id)
    WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Listers can update bookings for their listings"
    ON bookings FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    );

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = guest_id);

CREATE POLICY "Users can manage their own favorites"
    ON favorites FOR ALL
    USING (auth.uid() = guest_id);

-- Insert some default amenities
INSERT INTO amenities (name, icon) VALUES
    ('WiFi', 'wifi'),
    ('Pool', 'waves'),
    ('Kitchen', 'utensils'),
    ('Parking', 'car'),
    ('Air Conditioning', 'wind'),
    ('Heating', 'flame'),
    ('Washer', 'washing-machine'),
    ('Dryer', 'wind'),
    ('TV', 'tv'),
    ('Hot Tub', 'bath'),
    ('Gym', 'dumbbell'),
    ('Fireplace', 'flame'),
    ('Ocean View', 'eye'),
    ('Mountain View', 'mountain'),
    ('Pet Friendly', 'paw-print'),
    ('Workspace', 'laptop'),
    ('BBQ Grill', 'grill'),
    ('Garden', 'flower'),
    ('Balcony', 'home'),
    ('Beach Access', 'umbrella')
ON CONFLICT (name) DO NOTHING;

