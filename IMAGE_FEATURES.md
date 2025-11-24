# Image Features Guide

## 🎨 What's New

### 1. **Beautiful Image Gallery** ✅
- Multi-image grid layout with main image + thumbnails
- Click any image to open full-screen lightbox viewer
- Navigation arrows and thumbnail strip
- Smooth transitions and hover effects
- Mobile responsive

### 2. **Edit Listing Page** ✅
- Edit any listing you own at `/dashboard/lister/listings/[id]/edit`
- Edit button available on lister dashboard
- Pre-filled form with existing data
- Update and save changes

### 3. **Supabase Storage Integration** ✅ (Optional)
- Direct image uploads to Supabase Storage
- Secure file storage with access control
- Automatic URL generation
- Image management (upload, delete, set cover)

---

## 📸 Current Image System

Right now, listings use **external image URLs** (like Unsplash). This is perfect for:
- Quick development and testing
- No storage costs
- Simple to use

---

## 🚀 Upgrade to Supabase Storage (Optional)

If you want users to upload their own images:

### Step 1: Run Storage Setup
```sql
-- In Supabase Dashboard → SQL Editor
-- Copy and run: supabase/storage-setup.sql
```

This creates:
- `listing-images` bucket
- Security policies
- Access control

### Step 2: Update Listing Form

Replace the simple URL input in `components/listing-form.tsx` with the ImageUpload component:

```tsx
// Add import
import { ImageUpload } from "@/components/image-upload"

// Add state for images
const [uploadedImages, setUploadedImages] = useState([])

// Replace the image URL input section with:
<div className="space-y-4">
  <h3 className="font-semibold">Property Images</h3>
  <ImageUpload
    listingId={initialData?.id}
    existingImages={initialData?.images || []}
    onImagesChange={setUploadedImages}
  />
</div>
```

### Step 3: Update Form Submission

Modify the `createListing` and `updateListing` actions to handle the uploaded images array instead of a single URL.

---

## 🎯 Features of ImageUpload Component

- **Drag & Drop** - Upload multiple images at once
- **Preview Grid** - See all images before saving
- **Set Cover Image** - Choose which image is the main one
- **Delete Images** - Remove unwanted images
- **Progress Indicator** - See upload status
- **File Validation** - Only allows image files, max 5MB each

---

## 📱 Image Gallery Features

Located in: `components/image-gallery.tsx`

- **Grid Layout** - Large main image + 4 thumbnails
- **Lightbox Viewer** - Click to open full-screen view
- **Navigation** - Arrow keys and buttons to browse
- **Thumbnail Strip** - Quick access to all images
- **Image Counter** - "2 / 5" display
- **Mobile Optimized** - Responsive on all devices

---

## 🏗️ How Images Are Stored

### Current (External URLs):
```
listing_images table:
- id
- listing_id
- image_url (full URL like https://images.unsplash.com/...)
- is_cover (boolean)
```

### With Supabase Storage:
```
Storage: listing-images/{user_id}/{listing_id}/{filename}.jpg
Database: Same structure, but image_url points to Supabase

Example:
https://your-project.supabase.co/storage/v1/object/public/listing-images/user-123/listing-456/photo-1.jpg
```

---

## 💡 Tips

1. **For Development**: Keep using external URLs (Unsplash)
2. **For Production**: Set up Supabase Storage for better control
3. **Hybrid Approach**: Support both - check if URL starts with your Supabase URL

---

## 🔐 Security

Storage policies ensure:
- ✅ Anyone can view images (public bucket)
- ✅ Only authenticated users can upload
- ✅ Users can only delete their own images
- ✅ File size limited to 5MB

---

## 🐛 Troubleshooting

### Images not showing?
1. Check `next.config.js` has the domain in `remotePatterns`
2. Verify the image URL is valid
3. Check browser console for errors

### Upload failing?
1. Ensure storage setup SQL was run
2. Check user is authenticated
3. Verify file is under 5MB
4. Check file is an image type

### Edit page not found?
1. Make sure you're logged in as a lister
2. Verify you own the listing
3. Check the listing ID in the URL is correct

---

## 📚 Component Files

- **ImageGallery**: `components/image-gallery.tsx`
- **ImageUpload**: `components/image-upload.tsx`
- **Storage Actions**: `lib/actions/storage.ts`
- **Edit Page**: `app/dashboard/lister/listings/[id]/edit/page.tsx`
- **Storage Setup**: `supabase/storage-setup.sql`

