import React from 'react'
// import './AdminStyles.css'

export default function Logo() {
  return (
    <div className="logo-container" style={{ padding: '10px 0' }}>
      <div style={{ 
        fontFamily: "'Inter', sans-serif", 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: '#f4f4f5',
        letterSpacing: '-0.02em'
      }}>
        sidewalk<span style={{ color: '#71717a' }}>admin</span>
      </div>
    </div>
  )
}

