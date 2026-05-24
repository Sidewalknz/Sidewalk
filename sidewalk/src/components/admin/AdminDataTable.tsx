import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type AdminDataTableColumn<TData> = {
  id: string
  header: React.ReactNode
  headerClassName?: string
  cellClassName?: string
  cell: (row: TData, rowIndex: number) => React.ReactNode
}

export function AdminDataTable<TData>({
  data,
  columns,
  getRowKey,
  getRowProps,
  density = "spacious",
  tableClassName,
  headerClassName,
  headerRowClassName,
  bodyClassName,
  rowClassName,
  emptyState,
  emptyRowClassName,
  emptyCellClassName,
}: {
  data: TData[]
  columns: Array<AdminDataTableColumn<TData>>
  getRowKey?: (row: TData, rowIndex: number) => React.Key
  getRowProps?: (
    row: TData,
    rowIndex: number
  ) => React.HTMLAttributes<HTMLTableRowElement>
  density?: "spacious" | "compact"
  tableClassName?: string
  headerClassName?: string
  headerRowClassName?: string
  bodyClassName?: string
  rowClassName?: string | ((row: TData, rowIndex: number) => string | undefined)
  emptyState?: React.ReactNode
  emptyRowClassName?: string
  emptyCellClassName?: string
}) {
  const headerCellBase =
    density === "compact"
      ? "px-4 py-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto"
      : "px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] h-auto"

  const cellBase = density === "compact" ? "px-4 py-4" : "px-8 py-6"

  const rowBase = "group hover:bg-brand-50/30 transition-all duration-300"

  return (
    <Table className={cn("w-full text-left border-collapse", tableClassName)}>
      <TableHeader
        className={cn(
          "[&_tr]:border-b-0 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800",
          headerClassName
        )}
      >
        <TableRow className={cn("hover:bg-transparent", headerRowClassName)}>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(headerCellBase, column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className={cn("divide-y divide-slate-50 dark:divide-slate-800/70", bodyClassName)}>
        {data.map((row, rowIndex) => {
          const computedKey = getRowKey ? getRowKey(row, rowIndex) : rowIndex
          const props = getRowProps ? getRowProps(row, rowIndex) : undefined
          const { className: propsClassName, ...restProps } = props ?? {}
          const computedRowClassName =
            typeof rowClassName === "function"
              ? rowClassName(row, rowIndex)
              : rowClassName

          return (
            <TableRow
              key={computedKey}
              className={cn(rowBase, computedRowClassName, propsClassName)}
              {...restProps}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn("align-middle", cellBase, column.cellClassName)}
                >
                  {column.cell(row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          )
        })}

        {data.length === 0 ? (
          <TableRow className={cn("hover:bg-transparent", emptyRowClassName)}>
            <TableCell
              colSpan={columns.length}
              className={cn(cellBase, "py-20 text-center", emptyCellClassName)}
            >
              {emptyState ?? (
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                  No results
                </p>
              )}
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}

