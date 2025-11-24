# Supabase Database Setup

## 1. Initial Setup

### Run the schema (first time only):
1. Go to your Supabase Dashboard → SQL Editor
2. Copy contents of `schema.sql`
3. Paste and run

This creates all tables, functions, RLS policies, and default amenities.

## 2. Set Up Storage for Images (⚠️ Required for Image Uploads)

**Important**: Run this if you want users to upload images from their devices!

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of **`storage-setup.sql`**
3. Paste and run

This will create:
- **`listing-images`** storage bucket
- **Storage policies** for secure uploads
- **Proper access control** (users can only delete their own images)

✅ After setup:
- **New Listings**: Can add image URL initially
- **Edit Listing**: Full image upload functionality with drag & drop
- **Multiple Images**: Upload as many as you want (5MB each max)
- **Set Cover Image**: Choose which image is the main one

📝 **Note**: Without this setup, you can still use external image URLs (like Unsplash).

## 3. Add Sample Listings

### ⭐ Ready to Use (Recommended)
1. Go to Supabase Dashboard → SQL Editor  
2. Copy contents of **`seed-with-ids.sql`**
3. Paste and run

This will create:
- **4 listings for Kashyap** (Goa, Manali, Mumbai, Nainital)
- **5 listings for Aneesh** (Malibu, Palm Springs, Tuscany, Aspen, Maldives)
- Beautiful Unsplash images for each
- Appropriate amenities
- 6 featured listings

### Alternative Options

**Option A: Automatic User Lookup**
- Use `seed-listings-auto.sql` if user names change
- Automatically finds users by name

**Option B: Manual Customization**
- Use `seed-listings.sql` for full control
- Replace UUIDs with your user IDs

## Sample Listings Included

### Kashyap's Listings:
1. **Luxury villa by the Ocean** - Goa, India ($500/night) - ⭐ Featured
2. **Serene Mountain Retreat** - Manali, India ($750/night) - ⭐ Featured
3. **Luxury Penthouse with City Views** - Mumbai, India ($1,200/night)
4. **Tranquil Lakeside Villa** - Nainital, India ($650/night)

### Aneesh's Listings:
1. **Tropical Beach House Paradise** - Malibu, USA ($900/night) - ⭐ Featured
2. **Modern Desert Oasis** - Palm Springs, USA ($850/night) - ⭐ Featured
3. **Historic Countryside Manor** - Tuscany, Italy ($1,100/night)
4. **Luxury Alpine Ski Chalet** - Aspen, USA ($1,500/night) - ⭐ Featured
5. **Private Island Villa** - Maldives ($2,500/night) - ⭐ Featured

All listings include:
- High-quality Unsplash images
- Detailed descriptions
- Appropriate amenities
- Realistic pricing

## Troubleshooting

### "No user found" error:
Make sure you have profiles for users containing "kashyap" or "aneesh" in their names. Check with:
```sql
SELECT * FROM profiles;
```

### Reset and start over:
```sql
DELETE FROM listings;  -- This will cascade delete images, amenities, bookings
```

Then run the seed script again.

