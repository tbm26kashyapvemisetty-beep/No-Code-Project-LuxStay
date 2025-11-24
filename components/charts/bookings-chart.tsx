"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const mockData = [
  { month: "Jan", pending: 3, confirmed: 5, cancelled: 2 },
  { month: "Feb", pending: 2, confirmed: 10, cancelled: 1 },
  { month: "Mar", pending: 4, confirmed: 6, cancelled: 3 },
  { month: "Apr", pending: 5, confirmed: 10, cancelled: 2 },
  { month: "May", pending: 3, confirmed: 15, cancelled: 1 },
  { month: "Jun", pending: 6, confirmed: 14, cancelled: 2 },
  { month: "Jul", pending: 4, confirmed: 19, cancelled: 3 },
  { month: "Aug", pending: 5, confirmed: 16, cancelled: 2 },
  { month: "Sep", pending: 3, confirmed: 16, cancelled: 1 },
  { month: "Oct", pending: 4, confirmed: 13, cancelled: 2 },
  { month: "Nov", pending: 5, confirmed: 11, cancelled: 3 },
  { month: "Dec", pending: 7, confirmed: 18, cancelled: 2 },
]

export function BookingsChart() {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Bookings by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F1729', 
                border: '1px solid #FACC6B33',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="confirmed" fill="#34D399" name="Confirmed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#FACC6B" name="Pending" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

