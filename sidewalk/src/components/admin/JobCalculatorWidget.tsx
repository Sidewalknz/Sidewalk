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
        <div className="space-y-4 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
             <h3 className="text-lg font-semibold text-zinc-300">Job Calculator</h3>
             <div className="h-64 flex items-center justify-center text-zinc-500">Loading calculator...</div>
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
    <div className="space-y-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-300">Job Calculator</h3>
      
      <div className="grid grid-cols-[1fr_150px] gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-400">
            Total Amount ($)
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-400">
            Number of Owners
          </label>
          <input
            type="number"
            value={numberOfOwners}
            onChange={(e) => setNumberOfOwners(Math.max(1, Number(e.target.value) || 1))}
            min="1"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Category</th>
              <th className="px-4 py-3 text-center font-medium text-zinc-400 w-[100px]">%</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-400 w-[140px]">$ Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {allocations.map((allocation, index) => {
              const amount = calculateAmount(allocation.percentage)
              const isOwnerCompensation = allocation.category === 'Owner Compensation'
              const perPersonAmount = isOwnerCompensation ? amount / numberOfOwners : amount
              
              const displayAmount = isOwnerCompensation 
                ? `${formatCurrency(perPersonAmount)} / ${formatCurrency(amount)}`
                : formatCurrency(amount)
              
              return (
                <tr key={index} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-300">{allocation.category}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={allocation.percentage}
                      onChange={(e) => updatePercentage(index, Number(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-16 px-2 py-1 text-center bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-zinc-300">
                    {displayAmount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div 
        className={`flex items-center justify-between p-4 rounded-lg border ${
            totalPercentage === 100 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}
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
