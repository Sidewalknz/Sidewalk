import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import ExpenseForm from '@/components/admin/ExpenseForm'
import { updateExpense } from '@/actions/expenses'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditExpensePage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  let expense
  try {
    expense = await payload.findByID({
      collection: 'ongoing-expenses',
      id,
    })
  } catch (error) {
    notFound()
  }

  if (!expense) {
    notFound()
  }

  const updateExpenseAction = updateExpense.bind(null, expense.id)

  return <ExpenseForm initialData={expense} action={updateExpenseAction} mode="edit" />
}
