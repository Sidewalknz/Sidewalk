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
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
        Clients Summary
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: '#eff6ff', 
          borderRadius: '6px',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Total Clients
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
            {totalClients}
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#f0fdf4', 
          borderRadius: '6px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Total Cost
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalCost)}
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#fef3c7', 
          borderRadius: '6px',
          border: '1px solid #fde68a'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Average per Client
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(averagePerClient)}
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: '#fce7f3', 
          borderRadius: '6px',
          border: '1px solid #fbcfe8'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Average per Job
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9f1239' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(averagePerJob)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {totalProducts} total {totalProducts === 1 ? 'product' : 'products'}
          </div>
        </div>
      </div>
    </div>
  )
}

