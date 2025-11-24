"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = [
  { week: "Week 1", earnings: 4200 },
  { week: "Week 2", earnings: 6800 },
  { week: "Week 3", earnings: 5400 },
  { week: "Week 4", earnings: 8900 },
  { week: "Week 5", earnings: 7600 },
  { week: "Week 6", earnings: 9200 },
  { week: "Week 7", earnings: 11400 },
  { week: "Week 8", earnings: 10800 },
]

export function EarningsTrend() {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Weekly Earnings Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F1729', 
                border: '1px solid #FACC6B33',
                borderRadius: '8px'
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#34D399" 
              strokeWidth={3}
              dot={{ fill: '#34D399', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

