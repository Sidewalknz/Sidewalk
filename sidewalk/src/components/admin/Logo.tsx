'use client'

export default function Logo() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%',
      padding: '1rem 0'
    }}>
      <img
        src="/logo3.svg"
        alt="Logo"
        style={{ 
          height: 'auto', 
          width: 'auto', 
          maxHeight: '60px',
          maxWidth: '200px',
          display: 'block',
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback to logo3.svg if image fails to load
          const target = e.target as HTMLImageElement
          if (!target.src.endsWith('/logo3.svg')) {
            target.src = '/logo3.svg'
          }
        }}
      />
    </div>
  )
}
