'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExpense(prevState: any, formData: FormData): Promise<{ message: string }> {
  const payload = await getPayload({ config })

  const name = formData.get('name') as string
  const amount = Number(formData.get('amount'))
  const frequency = formData.get('frequency') as 'weekly' | 'monthly' | 'yearly'
  const startDate = formData.get('startDate') as string
  const category = formData.get('category') as string
  const notes = formData.get('notes') as string
  const isActive = formData.get('isActive') === 'on'

  try {
    await payload.create({
      collection: 'ongoing-expenses',
      data: {
        name,
        amount,
        frequency,
        startDate,
        category,
        notes,
        isActive,
      },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('Error creating expense:', error)
    return { message: 'Failed to create expense.' }
  }

  revalidatePath('/admin/ongoing-expenses')
  redirect('/admin/ongoing-expenses')
}

export async function updateExpense(id: string, prevState: any, formData: FormData): Promise<{ message: string }> {
  const payload = await getPayload({ config })

  const name = formData.get('name') as string
  const amount = Number(formData.get('amount'))
  const frequency = formData.get('frequency') as 'weekly' | 'monthly' | 'yearly'
  const startDate = formData.get('startDate') as string
  const category = formData.get('category') as string
  const notes = formData.get('notes') as string
  const isActive = formData.get('isActive') === 'on'

  try {
    await payload.update({
      collection: 'ongoing-expenses',
      id,
      data: {
        name,
        amount,
        frequency,
        startDate,
        category,
        notes,
        isActive,
      },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('Error updating expense:', error)
    return { message: 'Failed to update expense.' }
  }

  revalidatePath('/admin/ongoing-expenses')
  redirect('/admin/ongoing-expenses')
}
