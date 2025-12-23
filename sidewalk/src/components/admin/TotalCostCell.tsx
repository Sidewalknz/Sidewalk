'use client'

import type { CellComponent } from 'payload'

const TotalCostCell: CellComponent = ({ cellData, rowData }) => {
  const products = rowData?.products || []
  
  const totalCost = products.reduce((sum: number, product: any) => {
    const price = product?.price || 0
    return sum + (typeof price === 'number' ? price : 0)
  }, 0)

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalCost)

  return <span>{formattedTotal}</span>
}

export { TotalCostCell }
export default TotalCostCell

