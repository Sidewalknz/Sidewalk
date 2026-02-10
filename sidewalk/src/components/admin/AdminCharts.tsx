'use client'

import React, { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

import { useAdminTheme } from './AdminThemeProvider'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export const CategoryPieChart = ({
  data,
}: {
  data: { name: string; value: number }[]
}) => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useAdminTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ width: '100%', height: 300 }} />
  }
  
  const isDark = theme === 'blue' || theme === 'red'
  const textColor = isDark ? '#fff' : '#000'

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
                backgroundColor: 'var(--admin-sidebar-bg)', 
                borderColor: 'var(--admin-sidebar-border)',
                color: 'var(--admin-text)'
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const FinancialBarChart = ({
  data,
}: {
  data: { name: string; income: number; expense: number }[]
}) => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useAdminTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ width: '100%', height: 300 }} />
  }

  const isDark = theme === 'blue' || theme === 'red'
  const axisColor = isDark ? '#ccc' : '#333'

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
          <XAxis dataKey="name" stroke={axisColor} />
          <YAxis stroke={axisColor} />
          <Tooltip 
            formatter={(value) => `$${value}`}
            contentStyle={{ 
                backgroundColor: 'var(--admin-sidebar-bg)', 
                borderColor: 'var(--admin-sidebar-border)',
                color: 'var(--admin-text)'
            }}
          />
          <Legend wrapperStyle={{ color: axisColor }} />
          <Bar dataKey="income" name="Monthly Revenue" fill="#82ca9d" />
          <Bar dataKey="expense" name="Monthly Expenses" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
