import type { Payload } from 'payload'
import { FinancialBarChart } from './AdminCharts'

export default async function FinancialOverviewWidget({ payload }: { payload: Payload }) {
  const { docs: clients } = await payload.find({
    collection: 'clients',
    limit: 1000,
  })

  const { docs: expenses } = await payload.find({
    collection: 'ongoing-expenses',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 1000,
  })

  // Calculate Monthly Recurring Revenue (MRR)
  let mrr = 0
  clients.forEach((client) => {
    const products = client.products || []
    products.forEach((product: any) => {
      const monthlyFee = product.monthlyFee || 0
      mrr += monthlyFee
    })
  })

  // Calculate Monthly Expenses
  let monthlyExpenses = 0
  expenses.forEach((expense) => {
    const amount = expense.amount || 0
    const frequency = expense.frequency

    if (frequency === 'monthly') {
      monthlyExpenses += amount
    } else if (frequency === 'weekly') {
      monthlyExpenses += amount * 4.33 // Average weeks per month
    } else if (frequency === 'yearly') {
      monthlyExpenses += amount / 12
    }
  })

  const data = [
    {
      name: 'Financial Overview',
      income: Math.round(mrr),
      expense: Math.round(monthlyExpenses),
    },
  ]

  return (
    <div className="dashboard-widget">
      <h3>Financial Overview</h3>
      <div style={{ marginBottom: '1rem' }}>
        <FinancialBarChart data={data} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="dashboard-stat-card dashboard-stat-card--green">
          <div className="dashboard-stat-card__label">Projected Monthly Revenue</div>
          <div className="dashboard-stat-card__value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(mrr)}
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--red">
          <div className="dashboard-stat-card__label">Projected Monthly Expenses</div>
          <div className="dashboard-stat-card__value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(monthlyExpenses)}
          </div>
        </div>
      </div>
    </div>
  )
}
