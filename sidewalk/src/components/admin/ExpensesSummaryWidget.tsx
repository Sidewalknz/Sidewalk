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
    <div className="dashboard-widget">
      <h3>Ongoing Expenses Summary</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="dashboard-stat-card dashboard-stat-card--blue" style={{background: 'transparent', border: 'none', padding: 0}}>
           <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-success-500)' }}> 
             <span className="dashboard-stat-card__value" style={{color: '#2563eb'}}>{totalActive}</span>
           </div>
           <div className="dashboard-stat-card__label">Active Expenses</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="dashboard-stat-card dashboard-stat-card--blue">
          <div className="dashboard-stat-card__label">
            Weekly Total
          </div>
          <div className="dashboard-stat-card__value" style={{marginBottom: '0.25rem'}}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(weeklyTotal)}
          </div>
          <div className="dashboard-stat-card__subtext">
            All expenses converted to weekly
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--green">
          <div className="dashboard-stat-card__label">
            Monthly Total
          </div>
          <div className="dashboard-stat-card__value" style={{marginBottom: '0.25rem'}}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(monthlyTotal)}
          </div>
           <div className="dashboard-stat-card__subtext">
            All expenses converted to monthly
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--yellow">
          <div className="dashboard-stat-card__label">
            Yearly Total
          </div>
          <div className="dashboard-stat-card__value" style={{marginBottom: '0.25rem'}}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(yearlyTotal)}
          </div>
           <div className="dashboard-stat-card__subtext">
            All expenses converted to yearly
          </div>
        </div>
      </div>
    </div>
  )
}
