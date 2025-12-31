import type { Payload } from 'payload'

export default async function ClientsSummaryWidget({ payload }: { payload: Payload }) {
  const { docs: clients } = await payload.find({
    collection: 'clients',
  })

  const totalClients = clients.length

  // Calculate total cost from all products across all clients
  const totalCost = clients.reduce((sum, client) => {
    const products = client.products || []
    const clientTotal = products.reduce((productSum: number, product: any) => {
      const price = product?.price || 0
      return productSum + (typeof price === 'number' ? price : 0)
    }, 0)
    return sum + clientTotal
  }, 0)

  // Calculate total number of products/jobs
  const totalProducts = clients.reduce((sum, client) => {
    const products = client.products || []
    return sum + products.length
  }, 0)

  // Calculate averages
  const averagePerClient = totalClients > 0 ? totalCost / totalClients : 0
  const averagePerJob = totalProducts > 0 ? totalCost / totalProducts : 0

  return (
    <div className="dashboard-widget">
      <h3>Clients Summary</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="dashboard-stat-card dashboard-stat-card--blue">
          <div className="dashboard-stat-card__label">
            Total Clients
          </div>
          <div className="dashboard-stat-card__value">
            {totalClients}
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--green">
          <div className="dashboard-stat-card__label">
            Total Cost
          </div>
          <div className="dashboard-stat-card__value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalCost)}
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--yellow">
          <div className="dashboard-stat-card__label">
            Average per Client
          </div>
          <div className="dashboard-stat-card__value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(averagePerClient)}
          </div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card--pink">
          <div className="dashboard-stat-card__label">
            Average per Job
          </div>
          <div className="dashboard-stat-card__value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(averagePerJob)}
          </div>
          <div className="dashboard-stat-card__subtext">
            {totalProducts} total {totalProducts === 1 ? 'product' : 'products'}
          </div>
        </div>
      </div>
    </div>
  )
}

