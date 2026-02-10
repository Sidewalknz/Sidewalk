'use client'

import React from 'react'
import { createExpense } from '@/actions/expenses'
import ExpenseForm from '@/components/admin/ExpenseForm'

export default function AddExpensePage() {
  return <ExpenseForm action={createExpense} mode="create" />
}
