# LuxeStay - Luxury Airbnb Clone

A full-stack luxury property booking platform built with Next.js 15, TypeScript, Supabase, and shadcn/ui.

## Features

### Authentication & User Roles
- Email/password authentication with Supabase Auth
- Two user roles: **Guest** and **Lister/Host**
- Role-based dashboards and access control
- Onboarding flow for role selection

### For Guests
- Browse and search luxury properties
- Advanced filtering (location, price range, guest count)
- Favorite properties
- Book properties with date selection
- View upcoming and past trips
- Real-time booking availability

### For Hosts/Listers
- Create and manage property listings
- Set pricing and property details
- View and manage booking requests
- Approve or decline bookings
- Dashboard with revenue analytics
- Booking calendar management

### Booking System
- Date range picker with disabled booked dates
- Overlap prevention (no double-booking)
- Database-level booking clash detection
- Booking statuses: pending, confirmed, cancelled
- Total price calculation

### UI/UX
- Luxury dark theme with gold accents
- Fully responsive design
- Premium typography and animations
- shadcn/ui components throughout
- Modern glassmorphism effects

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Date Picker**: React Day Picker

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd airbnbluxclone
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Run the SQL schema in the Supabase SQL Editor:

```bash
# Copy contents of supabase/schema.sql and run in Supabase SQL Editor
```

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **profiles** - User profiles with roles
- **listings** - Property listings
- **listing_images** - Property images
- **amenities** - Available amenities
- **listing_amenities** - Junction table for listing amenities
- **bookings** - Booking records with date ranges
- **favorites** - User favorites

All tables include Row Level Security (RLS) policies for secure access control.

## Project Structure

```
airbnbluxclone/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── dashboard/
│   │   ├── guest/
│   │   └── lister/
│   ├── listings/
│   │   ├── [id]/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx
│   ├── booking-widget.tsx
│   ├── listings-grid.tsx
│   └── ...
├── lib/
│   ├── actions/            # Server actions
│   ├── supabase/           # Supabase clients
│   ├── types.ts
│   └── utils.ts
└── supabase/
    └── schema.sql          # Database schema
```

## Key Features Implementation

### Booking Overlap Prevention

The system prevents double-booking using:
1. Database function `check_booking_overlap()`
2. Server-side validation in booking creation
3. UI-level date picker disabling of booked dates

### Role-Based Access Control

- Implemented with Supabase RLS policies
- Server-side checks in all protected routes
- Client-side role-based UI rendering

### Image Handling

Currently uses URL inputs (Unsplash, etc.). Can be extended with Supabase Storage for file uploads.

## Color Scheme

- **Background**: Deep navy/charcoal (`#050816`)
- **Surface**: Deep slate (`#0F1729`)
- **Primary**: Champagne gold (`#FACC6B`)
- **Secondary**: Muted sage/teal (`#34D399`)
- **Accent**: Gold gradient

## Future Enhancements

- [ ] Image upload with Supabase Storage
- [ ] Review and rating system
- [ ] Advanced search with maps integration
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Admin dashboard
- [ ] Messaging between guests and hosts

## License

MIT

# No-Code-Project-LuxStay
