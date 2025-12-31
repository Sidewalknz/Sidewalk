'use client'

import { useState } from 'react'

interface Allocation {
  category: string
  percentage: number
}

const defaultAllocations: Allocation[] = [
  { category: 'Owner Compensation', percentage: 30 },
  { category: 'Admin / PM', percentage: 10 },
  { category: 'Designer', percentage: 30 },
  { category: 'Tax', percentage: 12 },
  { category: 'Operating Expenses', percentage: 10 },
  { category: 'Profit', percentage: 8 },
]

export default function JobCalculatorWidget() {
  const [totalAmount, setTotalAmount] = useState(3200)
  const [allocations, setAllocations] = useState<Allocation[]>(defaultAllocations)
  const [numberOfOwners, setNumberOfOwners] = useState(2)

  const updatePercentage = (index: number, newPercentage: number) => {
    const updated = [...allocations]
    updated[index].percentage = Math.max(0, Math.min(100, newPercentage))
    setAllocations(updated)
  }

  const calculateAmount = (percentage: number) => {
    return (totalAmount * percentage) / 100
  }

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0)
  const totalCalculated = allocations.reduce((sum, a) => sum + calculateAmount(a.percentage), 0)

  return (
    <div className="dashboard-widget">
      <h3>Job Calculator</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Total Amount ($)
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              fontSize: '1rem',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Number of Owners
          </label>
          <input
            type="number"
            value={numberOfOwners}
            onChange={(e) => setNumberOfOwners(Math.max(1, Number(e.target.value) || 1))}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              fontSize: '1rem',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)'
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--theme-elevation-200)' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Category</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600', width: '100px' }}>%</th>
              <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', width: '120px' }}>$ Amount</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation, index) => {
              const amount = calculateAmount(allocation.percentage)
              const isOwnerCompensation = allocation.category === 'Owner Compensation'
              const perPersonAmount = isOwnerCompensation ? amount / numberOfOwners : amount
              
              const formatCurrency = (value: number) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
              
              const displayAmount = isOwnerCompensation 
                ? `${formatCurrency(perPersonAmount)} / ${formatCurrency(amount)}`
                : formatCurrency(amount)
              
              return (
                <tr key={index} style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                  <td style={{ padding: '0.75rem' }}>{allocation.category}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <input
                      type="number"
                      value={allocation.percentage}
                      onChange={(e) => updatePercentage(index, Number(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      style={{
                        width: '70px',
                        padding: '0.25rem',
                        border: '1px solid var(--theme-elevation-200)',
                        borderRadius: '4px',
                        textAlign: 'center',
                        background: 'var(--theme-input-bg)',
                        color: 'var(--theme-text)'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                    {displayAmount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: totalPercentage === 100 ? 'var(--theme-success-100)' : 'var(--theme-error-100)',
        borderRadius: '4px',
        border: `1px solid ${totalPercentage === 100 ? 'var(--theme-success-200)' : 'var(--theme-error-200)'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: totalPercentage === 100 ? 'var(--theme-success-700)' : 'var(--theme-error-700)'
      }}>
        <div>
          <span style={{ fontWeight: '600' }}>
            {totalPercentage === 100 ? '✓' : '⚠'} Totals = 
          </span>
          <span style={{ 
            fontWeight: 'bold', 
            marginLeft: '0.5rem',
            color: 'inherit'
          }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalCalculated)}
          </span>
          {totalPercentage !== 100 && (
            <span style={{ marginLeft: '0.5rem', color: 'inherit', fontSize: '0.875rem' }}>
              ({totalPercentage}% - should be 100%)
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
          Total: {totalPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

