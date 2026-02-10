import React from 'react'
import { LayoutDashboard } from 'lucide-react'

export default function Icon() {
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
    }}>
      <LayoutDashboard size={24} color="#f4f4f5" />
    </div>
  )
}

