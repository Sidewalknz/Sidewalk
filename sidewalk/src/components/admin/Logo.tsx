'use client'

export default function Logo() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%', 
      minHeight: '40px',
      width: 'auto'
    }}>
      <img
        src="/logo3.svg"
        alt="Logo"
        style={{ 
          height: 'auto', 
          width: 'auto', 
          maxHeight: '40px',
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
