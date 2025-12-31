import type { Payload } from 'payload'

export default async function ExpensesByCategoryWidget({ payload }: { payload: Payload }) {
  const { docs: expenses } = await payload.find({
    collection: 'ongoing-expenses',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  // Group expenses by category
  const categoryMap = new Map<string, { count: number; total: number }>()
  
  expenses.forEach((expense) => {
    const category = expense.category || 'Uncategorized'
    const amount = expense.amount || 0
    
    const existing = categoryMap.get(category) || { count: 0, total: 0 }
    categoryMap.set(category, {
      count: existing.count + 1,
      total: existing.total + amount,
    })
  })

  const categories = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      ...data,
    }))
    .sort((a, b) => b.total - a.total)

  if (categories.length === 0) {
    return (
      <div className="dashboard-widget">
        <h3>
          Expenses by Category
        </h3>
        <p>No expenses with categories yet.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-widget">
      <h3>
        Expenses by Category
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
                {item.count} {item.count === 1 ? 'expense' : 'expenses'}
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
