import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { getUser, getProfile } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/server"
import { Sparkles, MapPin, TrendingUp, Calendar, DollarSign, Home as HomeIcon } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { SearchBar } from "@/components/search-bar"
import { PriceDisplay } from "@/components/price-display"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { BookingsChart } from "@/components/charts/bookings-chart"
import { OccupancyChart } from "@/components/charts/occupancy-chart"
import { EarningsTrend } from "@/components/charts/earnings-trend"
import { StatCard } from "@/components/stat-card"
import { redirect } from "next/navigation"

async function getAllListings() {
  const supabase = await createClient()
  
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      images:listing_images(*)
    `)
    .order("created_at", { ascending: false })
    .limit(12)

  return listings || []
}

async function getListerStats(userId: string) {
  const supabase = await createClient()

  // Get listings count
  const { data: listings } = await supabase
    .from("listings")
    .select("id, nightly_price")
    .eq("owner_id", userId)

  // Get bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, listing:listings!listing_id(owner_id)")
    .eq("listing.owner_id", userId)

  const totalListings = listings?.length || 0
  const totalBookings = bookings?.length || 0
  const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0
  const confirmedBookings = bookings?.filter(b => b.status === "confirmed").length || 0
  const totalRevenue = bookings
    ?.filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + parseFloat(b.total_price.toString()), 0) || 0

  const avgNightlyRate = listings?.length 
    ? listings.reduce((sum, l) => sum + parseFloat(l.nightly_price.toString()), 0) / listings.length
    : 0

  return {
    totalListings,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalRevenue,
    avgNightlyRate,
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code as string | undefined

  // Handle auth code from email verification
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Auth code exchange:', { data: !!data, error })
    
    if (error) {
      console.error('Error exchanging code:', error)
      redirect(`/login?error=${encodeURIComponent('Failed to verify email. Please try logging in.')}`)
    }
    
    if (data.session) {
      // Successfully authenticated, check if needs onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      console.log('User after exchange:', user?.email)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        console.log('Profile:', profile)

        // If no profile or no role, redirect to onboarding
        if (!profile || !profile.role) {
          redirect('/onboarding')
        }
        
        // User has profile, redirect to home without code parameter
        redirect('/')
      }
    }
  }

  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  // If user is a lister, show analytics dashboard
  if (user && profile?.role === "lister") {
    const stats = await getListerStats(user.id)

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} profile={profile} />

        <main className="flex-1 container py-8 space-y-8">
          {/* Hero Section with Quick Actions */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 luxury-heading">
                    Welcome back, {profile.full_name}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage your properties and grow your hosting business
                  </p>
                </div>
              </div>

              {/* Quick Actions - Now at the top */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/lister/listings/new">
                  <Card className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer border-primary/30 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HomeIcon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Create Listing</h3>
                        <p className="text-sm text-muted-foreground">Add a new property</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/lister">
                  <Card className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer border-primary/30 hover:border-primary/50">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="h-7 w-7 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Bookings</h3>
                        <p className="text-sm text-muted-foreground">{stats.pendingBookings} pending</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/lister">
                  <Card className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer border-primary/30 hover:border-primary/50">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">My Listings</h3>
                        <p className="text-sm text-muted-foreground">{stats.totalListings} properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
          </div>

          {/* Stats Grid */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Listings"
              value={stats.totalListings}
              icon="home"
              trend="up"
              trendValue="+2 this month"
              colorClass="bg-primary/10 text-primary"
            />

            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              subtitle={`${stats.confirmedBookings} confirmed`}
              icon="calendar"
              trend="up"
              trendValue="+15%"
              colorClass="bg-secondary/10 text-secondary"
            />

            <StatCard
              title="Total Revenue"
              value={<PriceDisplay amount={stats.totalRevenue} />}
              icon="dollar"
              trend="up"
              trendValue="+23%"
              colorClass="bg-primary/10 text-primary"
            />

            <StatCard
              title="Pending Requests"
              value={stats.pendingBookings}
              subtitle="Awaiting your response"
              icon="trending"
              colorClass="bg-secondary/10 text-secondary"
            />

            <StatCard
              title="Avg Nightly Rate"
              value={<PriceDisplay amount={stats.avgNightlyRate} />}
              icon="sparkles"
              trend="up"
              trendValue="+8%"
              colorClass="bg-primary/10 text-primary"
            />

            <StatCard
              title="Occupancy Rate"
              value={`${stats.totalListings > 0 ? Math.round((stats.confirmedBookings / (stats.totalListings * 30)) * 100) : 0}%`}
              subtitle="Last 30 days"
              icon="trending"
              trend="up"
              trendValue="+12%"
              colorClass="bg-secondary/10 text-secondary"
            />
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <BookingsChart />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsTrend />
              <OccupancyChart />
            </div>
          </div>
        </main>
      </div>
    )
  }

  // For guests and non-logged in users, show search and listings
  const allListings = await getAllListings()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} profile={profile} />

      {/* Hero Section with Search */}
      <section className="relative py-20 px-4 sm:py-32 luxury-gradient overflow-visible">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="container relative z-10">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium Luxury Properties Worldwide
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="luxury-heading">
                Find Your Perfect
              </span>
              <br />
              <span className="text-foreground">
                Luxury Escape
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover handpicked luxury properties from oceanfront villas to mountain retreats
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* All Listings Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore Properties</h2>
              <p className="text-muted-foreground">
                {allListings.length} luxury stays available
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/listings">View All Filters</Link>
            </Button>
          </div>

          {allListings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for luxury listings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allListings.map((listing) => {
                const coverImage = listing.images?.find((img: any) => img.is_cover) || listing.images?.[0]
                
                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                      <div className="relative h-56 bg-muted overflow-hidden">
                        {coverImage?.image_url ? (
                          <SafeImage
                            src={coverImage.image_url}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                            <Sparkles className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        {listing.featured && (
                          <Badge className="absolute top-3 right-3 gold-gradient">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {listing.city}, {listing.country}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{listing.max_guests} guests</span>
                          <span>·</span>
                          <span>{listing.bedrooms} bed</span>
                          <span>·</span>
                          <span>{listing.bathrooms} bath</span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="font-bold text-lg">
                            <PriceDisplay amount={listing.nightly_price} showPerNight />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 bg-card/30">
          <div className="container">
            <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Join thousands of travelers or become a host and share your luxury property
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" asChild className="gold-gradient">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg luxury-heading">LuxeStay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LuxeStay. Premium luxury rentals worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
