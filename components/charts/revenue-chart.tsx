"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const mockData = [
  { month: "Jan", revenue: 12400, bookings: 8 },
  { month: "Feb", revenue: 18900, bookings: 12 },
  { month: "Mar", revenue: 15600, bookings: 10 },
  { month: "Apr", revenue: 22100, bookings: 15 },
  { month: "May", revenue: 28500, bookings: 18 },
  { month: "Jun", revenue: 31200, bookings: 20 },
  { month: "Jul", revenue: 35800, bookings: 23 },
  { month: "Aug", revenue: 33400, bookings: 21 },
  { month: "Sep", revenue: 29700, bookings: 19 },
  { month: "Oct", revenue: 26300, bookings: 17 },
  { month: "Nov", revenue: 24800, bookings: 16 },
  { month: "Dec", revenue: 38900, bookings: 25 },
]

export function RevenueChart() {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC6B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FACC6B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F1729', 
                border: '1px solid #FACC6B33',
                borderRadius: '8px'
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#FACC6B" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

