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
      <div className="dashboard-widget">
        <h3>Products by Category</h3>
        <p>No products with categories yet.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-widget">
      <h3>
        Products by Category
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {categories.map((item) => (
          <div 
            key={item.category}
            className="dashboard-list-item"
          >
            <div>
              <div className="dashboard-list-item__title">{item.category}</div>
              <div className="dashboard-list-item__subtitle">
                {item.count} {item.count === 1 ? 'product' : 'products'}
              </div>
            </div>
            <div className="dashboard-list-item__value">
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
