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
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
        Job Calculator
      </h3>
      
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
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '1rem',
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
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
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
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
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
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        textAlign: 'center',
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
        background: totalPercentage === 100 ? '#f0fdf4' : '#fef2f2',
        borderRadius: '4px',
        border: `1px solid ${totalPercentage === 100 ? '#bbf7d0' : '#fecaca'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: '600' }}>
            {totalPercentage === 100 ? '✓' : '⚠'} Totals = 
          </span>
          <span style={{ 
            fontWeight: 'bold', 
            marginLeft: '0.5rem',
            color: totalPercentage === 100 ? '#166534' : '#dc2626'
          }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalCalculated)}
          </span>
          {totalPercentage !== 100 && (
            <span style={{ marginLeft: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
              ({totalPercentage}% - should be 100%)
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Total: {totalPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

