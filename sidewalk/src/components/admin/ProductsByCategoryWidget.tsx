import type { Payload } from 'payload'

export default async function ProductsByCategoryWidget({ payload }: { payload: Payload }) {
  const { docs: clients } = await payload.find({
    collection: 'clients',
  })

  // Group products by category
  const categoryMap = new Map<string, { count: number; total: number }>()
  
  clients.forEach((client) => {
    const products = client.products || []
    
    products.forEach((product: any) => {
      const category = product?.category || 'Uncategorized'
      const price = product?.price || 0
      
      const existing = categoryMap.get(category) || { count: 0, total: 0 }
      categoryMap.set(category, {
        count: existing.count + 1,
        total: existing.total + price,
      })
    })
  })

  const categories = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      ...data,
    }))
    .sort((a, b) => b.total - a.total)

  if (categories.length === 0) {
    return (
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
          Products by Category
        </h3>
        <p style={{ color: '#6b7280', margin: 0 }}>No products with categories yet.</p>
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
        Products by Category
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {categories.map((item) => (
          <div 
            key={item.category}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px'
            }}
          >
            <div>
              <div style={{ fontWeight: '600' }}>{item.category}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {item.count} {item.count === 1 ? 'product' : 'products'}
              </div>
            </div>
            <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

