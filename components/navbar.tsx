"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Sparkles } from "lucide-react"
import { Profile } from "@/lib/types"
import { NavbarCurrencySelector } from "@/components/navbar-currency-selector"

interface NavbarProps {
  user?: {
    id: string
    email?: string
  } | null
  profile?: Profile | null
}

export function Navbar({ user, profile }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold luxury-heading">LuxeStay</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/listings" className="transition-colors hover:text-primary">
            Browse Stays
          </Link>
          {profile?.role === "lister" && (
            <Link href="/dashboard/lister" className="transition-colors hover:text-primary">
              My Listings
            </Link>
          )}
          {profile?.role === "guest" && (
            <Link href="/dashboard/guest" className="transition-colors hover:text-primary">
              My Trips
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <NavbarCurrencySelector />
          
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-primary capitalize">{profile.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile.role === "guest" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/guest">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/guest#favorites">Favorites</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {profile.role === "lister" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/lister">My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/lister/listings/new">Create Listing</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action="/auth/signout" method="post" className="w-full">
                    <button type="submit" className="w-full text-left">
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="gold-gradient">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

