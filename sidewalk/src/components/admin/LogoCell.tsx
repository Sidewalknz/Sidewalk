'use client'

import React from 'react'

interface LogoCellProps {
  cellData?: string
}

const LogoCell = ({ cellData }: LogoCellProps) => {
  if (!cellData) return null

  return (
    <div
      style={{
        height: '40px',
        width: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cellData}
        alt="Logo"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export { LogoCell }
export default LogoCell
