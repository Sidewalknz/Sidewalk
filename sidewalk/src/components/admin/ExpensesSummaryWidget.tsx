import type { Payload } from 'payload'

function calculateNextDueDate(startDate: string | Date, frequency: string): Date {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const now = new Date()
  let nextDue = new Date(start)

  while (nextDue <= now) {
    if (frequency === 'weekly') {
      nextDue.setDate(nextDue.getDate() + 7)
    } else if (frequency === 'monthly') {
      nextDue.setMonth(nextDue.getMonth() + 1)
    } else if (frequency === 'yearly') {
      nextDue.setFullYear(nextDue.getFullYear() + 1)
    } else {
      break
    }
  }

  return nextDue
}

export default async function ExpensesSummaryWidget({ payload }: { payload: Payload }) {
  const { docs: expenses } = await payload.find({
    collection: 'ongoing-expenses',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const totalActive = expenses.length
  
  // Calculate totals converted to each frequency
  // Weekly total: weekly expenses + monthly/52 + yearly/52
  const weeklyTotal = expenses.reduce((sum, expense) => {
    const amount = expense.amount || 0
    if (expense.frequency === 'weekly') {
      return sum + amount
    } else if (expense.frequency === 'monthly') {
      return sum + amount / 4.33 // Convert monthly to weekly
    } else if (expense.frequency === 'yearly') {
      return sum + amount / 52 // Convert yearly to weekly
    }
    return sum
  }, 0)

  // Monthly total: weekly*4.33 + monthly + yearly/12
  const monthlyTotal = expenses.reduce((sum, expense) => {
    const amount = expense.amount || 0
    if (expense.frequency === 'weekly') {
      return sum + amount * 4.33 // Convert weekly to monthly
    } else if (expense.frequency === 'monthly') {
      return sum + amount
    } else if (expense.frequency === 'yearly') {
      return sum + amount / 12 // Convert yearly to monthly
    }
    return sum
  }, 0)

  // Yearly total: weekly*52 + monthly*12 + yearly
  const yearlyTotal = expenses.reduce((sum, expense) => {
    const amount = expense.amount || 0
    if (expense.frequency === 'weekly') {
      return sum + amount * 52 // Convert weekly to yearly
    } else if (expense.frequency === 'monthly') {
      return sum + amount * 12 // Convert monthly to yearly
    } else if (expense.frequency === 'yearly') {
      return sum + amount
    }
    return sum
  }, 0)

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
        Ongoing Expenses Summary
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {totalActive}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Expenses</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: '#eff6ff', 
          borderRadius: '6px',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Weekly Total
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.25rem' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(weeklyTotal)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            All expenses converted to weekly
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#f0fdf4', 
          borderRadius: '6px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Monthly Total
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.25rem' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(monthlyTotal)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            All expenses converted to monthly
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#fef3c7', 
          borderRadius: '6px',
          border: '1px solid #fde68a'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Yearly Total
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e', marginBottom: '0.25rem' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(yearlyTotal)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            All expenses converted to yearly
          </div>
        </div>
      </div>
    </div>
  )
}

