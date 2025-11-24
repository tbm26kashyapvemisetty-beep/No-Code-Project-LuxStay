"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, Calendar, DollarSign, TrendingUp, Sparkles } from "lucide-react"

const iconMap = {
  home: Home,
  calendar: Calendar,
  dollar: DollarSign,
  trending: TrendingUp,
  sparkles: Sparkles,
}

type IconName = keyof typeof iconMap

interface StatCardProps {
  title: string
  value: string | number | React.ReactNode
  subtitle?: string
  icon: IconName
  trend?: "up" | "down"
  trendValue?: string
  colorClass?: string
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  colorClass = "bg-primary/10 text-primary" 
}: StatCardProps) {
  const Icon = iconMap[icon]
  
  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2 font-medium">{title}</p>
            <p className="text-3xl font-bold text-primary mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={`h-14 w-14 rounded-xl ${colorClass} flex items-center justify-center transition-transform hover:scale-110`}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

