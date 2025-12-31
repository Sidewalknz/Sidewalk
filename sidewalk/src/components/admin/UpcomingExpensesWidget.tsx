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

export default async function UpcomingExpensesWidget({ payload }: { payload: Payload }) {
  const { docs: expenses } = await payload.find({
    collection: 'ongoing-expenses',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const now = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  // Calculate next due dates and filter for upcoming expenses
  const upcomingExpenses = expenses
    .map((expense) => {
      if (!expense.startDate || !expense.frequency) return null
      
      const nextDue = calculateNextDueDate(expense.startDate, expense.frequency)
      
      if (nextDue >= now && nextDue <= thirtyDaysFromNow) {
        return {
          name: expense.name || 'Unnamed Expense',
          amount: expense.amount || 0,
          nextDue,
          frequency: expense.frequency,
        }
      }
      return null
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime())
    .slice(0, 5) // Show top 5 upcoming

  if (upcomingExpenses.length === 0) {
    return (
      <div className="dashboard-widget">
        <h3>
          Upcoming Expenses (Next 30 Days)
        </h3>
        <p>No expenses due in the next 30 days.</p>
      </div>
    )
  }

  const totalUpcoming = upcomingExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="dashboard-widget">
      <h3>
        Upcoming Expenses (Next 30 Days)
      </h3>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalUpcoming)}
        </div>
        <div style={{ color: 'var(--theme-elevation-450)', fontSize: '0.875rem' }}>
          Total due in next 30 days
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {upcomingExpenses.map((expense, index) => {
          const daysUntil = Math.ceil(
            (expense.nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
          
          return (
            <div 
              key={index}
              className="dashboard-list-item"
            >
              <div>
                <div className="dashboard-list-item__title">{expense.name}</div>
                <div className="dashboard-list-item__subtitle">
                  {expense.nextDue.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} • {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className="dashboard-list-item__value">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(expense.amount)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

