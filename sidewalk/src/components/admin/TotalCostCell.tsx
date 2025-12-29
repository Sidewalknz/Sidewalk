'use client'

interface TotalCostCellProps {
  cellData?: unknown
  rowData?: {
    products?: Array<{
      price?: number
    }>
  }
}

const TotalCostCell = ({ cellData: _cellData, rowData }: TotalCostCellProps) => {
  const products = rowData?.products || []
  
  const totalCost = products.reduce((sum: number, product) => {
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

