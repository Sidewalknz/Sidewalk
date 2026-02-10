'use client'

import { useState, useEffect } from 'react'

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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  if (!isClient) {
    return (
        <div className="space-y-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
             <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>Job Calculator</h3>
             <div className="h-64 flex items-center justify-center p-4" style={{ color: 'var(--admin-text-muted)' }}>Loading calculator...</div>
        </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6 p-6 rounded-xl" style={{ backgroundColor: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-sidebar-border)' }}>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>Job Calculator</h3>
      
      <div className="grid grid-cols-[1fr_150px] gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>
            Total Amount ($)
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2"
            style={{ 
                backgroundColor: 'var(--admin-bg)', 
                borderColor: 'var(--admin-sidebar-border)', 
                color: 'var(--admin-text)',
                borderWidth: '1px'
            }}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>
            Number of Owners
          </label>
          <input
            type="number"
            value={numberOfOwners}
            onChange={(e) => setNumberOfOwners(Math.max(1, Number(e.target.value) || 1))}
            min="1"
            className="w-full px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2"
            style={{ 
                backgroundColor: 'var(--admin-bg)', 
                borderColor: 'var(--admin-sidebar-border)', 
                color: 'var(--admin-text)',
                borderWidth: '1px'
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg" style={{ border: '1px solid var(--admin-sidebar-border)', backgroundColor: 'var(--admin-bg)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-sidebar-border)', backgroundColor: 'var(--admin-sidebar-bg)' }}>
              <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--admin-text-muted)' }}>Category</th>
              <th className="px-4 py-3 text-center font-medium w-[100px]" style={{ color: 'var(--admin-text-muted)' }}>%</th>
              <th className="px-4 py-3 text-right font-medium w-[140px]" style={{ color: 'var(--admin-text-muted)' }}>$ Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
            {allocations.map((allocation, index) => {
              const amount = calculateAmount(allocation.percentage)
              const isOwnerCompensation = allocation.category === 'Owner Compensation'
              const perPersonAmount = isOwnerCompensation ? amount / numberOfOwners : amount
              
              const displayAmount = isOwnerCompensation 
                ? `${formatCurrency(perPersonAmount)} / ${formatCurrency(amount)}`
                : formatCurrency(amount)
              
              return (
                <tr key={index} className="transition-colors" style={{ borderBottom: '1px solid var(--admin-sidebar-border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--admin-text)' }}>{allocation.category}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={allocation.percentage}
                      onChange={(e) => updatePercentage(index, Number(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-16 px-2 py-1 text-center rounded text-xs focus:outline-none transition-colors"
                      style={{ 
                          backgroundColor: 'var(--admin-sidebar-bg)', 
                          border: '1px solid var(--admin-sidebar-border)', 
                          color: 'var(--admin-text)' 
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium" style={{ color: 'var(--admin-text)' }}>
                    {displayAmount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div 
        className="flex items-center justify-between p-4 rounded-lg border"
        style={{
            backgroundColor: totalPercentage === 100 ? 'rgba(33, 44, 52, 0.05)' : 'rgba(205, 80, 55, 0.1)',
            borderColor: totalPercentage === 100 ? 'var(--admin-sidebar-border)' : 'var(--brand-red)',
            color: totalPercentage === 100 ? 'var(--admin-text)' : 'var(--brand-red)'
        }}
      >
        <div className="flex items-center">
          <span className="font-semibold text-lg mr-2">
            {totalPercentage === 100 ? '✓' : '⚠'} Totals = 
          </span>
          <span className="text-xl font-bold">
            {formatCurrency(totalCalculated)}
          </span>
          {totalPercentage !== 100 && (
            <span className="ml-2 text-sm opacity-90">
              ({totalPercentage}% - should be 100%)
            </span>
          )}
        </div>
        <div className="text-sm font-medium opacity-80">
          Total: {totalPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}
