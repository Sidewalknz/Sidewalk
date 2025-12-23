'use client'

export default function Icon() {
  return (
    <div style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '24px',
      paddingRight: '8px',
      width: 'auto',
      height: '100%',
      verticalAlign: 'middle',
      position: 'relative',
      zIndex: 1
    }}>
      <img
        src="/logo3.svg"
        alt=""
        style={{ 
          height: '20px', 
          width: 'auto', 
          maxHeight: '20px',
          maxWidth: '50px',
          display: 'block',
          objectFit: 'contain',
          margin: 0,
          padding: 0,
          verticalAlign: 'middle',
          position: 'relative',
          zIndex: 1
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
