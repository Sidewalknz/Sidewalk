'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

type Id = string | number
type Frequency = 'weekly' | 'monthly' | 'yearly'

function toIsoDate(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim().length === 0) return undefined
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function toNumber(raw: unknown): number {
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0)
}

function readOutgoingForm(formData: FormData, existing?: any) {
  const status = (formData.get('status') as string) || 'active'
  const existingStatus = String(existing?.status || 'active')
  const existingEndDate = existing?.endDate || undefined
  const endDate =
    status === 'active'
      ? null
      : existingStatus === 'active' || !existingEndDate
        ? new Date().toISOString()
        : existingEndDate

  return {
    name: (formData.get('name') as string) || '',
    amount: toNumber(formData.get('amount')),
    frequency: (formData.get('frequency') as Frequency) || 'monthly',
    startDate: toIsoDate(formData.get('startDate')),
    category: (formData.get('category') as string) || '',
    adminNotes: (formData.get('adminNotes') as string) || '',
    status,
    endDate,
  }
}

function asMonthlyAmount(amount: number, frequency: Frequency) {
  if (frequency === 'weekly') return (amount * 52) / 12
  if (frequency === 'yearly') return amount / 12
  return amount
}

function asWeeklyAmount(amount: number, frequency: Frequency) {
  if (frequency === 'monthly') return amount / 4
  if (frequency === 'yearly') return amount / 52
  return amount
}

function asYearlyAmount(amount: number, frequency: Frequency) {
  if (frequency === 'weekly') return amount * 52
  if (frequency === 'monthly') return amount * 12
  return amount
}

function clampToDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addFrequency(date: Date, frequency: Frequency) {
  const next = new Date(date)
  if (frequency === 'weekly') next.setDate(next.getDate() + 7)
  if (frequency === 'monthly') next.setMonth(next.getMonth() + 1)
  if (frequency === 'yearly') next.setFullYear(next.getFullYear() + 1)
  return next
}

function getNextDueDate(rawStartDate: string | null | undefined, frequency: Frequency, from = new Date()) {
  if (!rawStartDate) return null
  let due = clampToDay(new Date(rawStartDate))
  if (Number.isNaN(due.getTime())) return null
  const today = clampToDay(from)
  let guard = 0
  while (due.getTime() < today.getTime() && guard < 1000) {
    due = addFrequency(due, frequency)
    guard += 1
  }
  return due
}

function normaliseOutgoing(doc: any) {
  const amount = Number(doc?.amount || 0)
  const frequency = (doc?.frequency || 'monthly') as Frequency
  const monthlyAmount = asMonthlyAmount(amount, frequency)
  const weeklyAmount = asWeeklyAmount(amount, frequency)
  const yearlyAmount = asYearlyAmount(amount, frequency)
  const nextDueDate = getNextDueDate(doc?.startDate, frequency)

  return {
    id: String(doc?.id || ''),
    name: String(doc?.name || ''),
    amount,
    frequency,
    category: String(doc?.category || ''),
    status: String(doc?.status || 'active'),
    startDate: doc?.startDate || '',
    endDate: doc?.endDate || '',
    adminNotes: String(doc?.adminNotes || ''),
    monthlyAmount,
    weeklyAmount,
    yearlyAmount,
    nextDueDate: nextDueDate ? nextDueDate.toISOString() : null,
  }
}

export async function getOutgoingsAdmin(
  search?: string,
  sort: string = '-createdAt',
  status?: string,
  page: number = 1,
  limit: number = 1000,
) {
  const payload = await getPayload({ config })
  const query: any = { collection: 'Outgoings', sort, page, limit, depth: 0 }
  const and: any[] = []

  if (search) {
    and.push({
      or: [
        { name: { contains: search } },
        { category: { contains: search } },
        { adminNotes: { contains: search } },
      ],
    })
  }

  if (status && status !== 'all') {
    and.push({ status: { equals: status } })
  }

  if (and.length) query.where = { and }

  return payload.find(query)
}

export async function getOutgoingById(id: Id) {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'Outgoings', id: String(id), depth: 0 })
}

export async function deleteOutgoing(id: Id) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'Outgoings', id: String(id) })
  revalidatePath('/admin/outgoings')
  revalidatePath('/admin')
}

export async function createOutgoing(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    await payload.create({ collection: 'Outgoings', data: readOutgoingForm(formData) as any })
    revalidatePath('/admin/outgoings')
    revalidatePath('/admin')
    return { message: 'success: Outgoing created successfully' }
  } catch (error: any) {
    console.error('Error in createOutgoing:', JSON.stringify(error, null, 2))
    return { message: `error: ${error.message || 'Failed to create outgoing'}` }
  }
}

export async function updateOutgoing(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const id = String(formData.get('id') || '')
    const existing = await payload.findByID({ collection: 'Outgoings', id, depth: 0 }).catch(() => null as any)
    await payload.update({ collection: 'Outgoings', id, data: readOutgoingForm(formData, existing) as any })
    revalidatePath('/admin/outgoings')
    revalidatePath(`/admin/outgoings/${id}`)
    revalidatePath('/admin')
    return { message: 'success: Outgoing updated successfully' }
  } catch (error: any) {
    console.error('Error in updateOutgoing:', JSON.stringify(error, null, 2))
    return { message: `error: ${error.message || 'Failed to update outgoing'}` }
  }
}

export async function getOutgoingsDashboardSummary() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'Outgoings',
    where: { status: { equals: 'active' } },
    depth: 0,
    limit: 1000,
    sort: 'startDate',
  })

  const outgoings = (res.docs || []).map(normaliseOutgoing)
  const weeklyTotal = outgoings.reduce((sum, item) => sum + item.weeklyAmount, 0)
  const monthlyTotal = outgoings.reduce((sum, item) => sum + item.monthlyAmount, 0)
  const yearlyTotal = outgoings.reduce((sum, item) => sum + item.yearlyAmount, 0)
  const upcoming = outgoings
    .filter((item) => item.nextDueDate)
    .sort((a, b) => new Date(a.nextDueDate || 0).getTime() - new Date(b.nextDueDate || 0).getTime())
    .slice(0, 5)

  const now = new Date()
  const monthlyTrend = Array.from({ length: 6 }).map((_, idx) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1)
    const activeForMonth = outgoings.filter((item) => {
      const start = item.startDate ? new Date(item.startDate) : null
      const end = item.endDate ? new Date(item.endDate) : null
      if (start && start > new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)) return false
      if (end && end < date) return false
      return true
    })
    return {
      label: new Intl.DateTimeFormat('en-NZ', { month: 'short' }).format(date),
      amount: activeForMonth.reduce((sum, item) => sum + item.monthlyAmount, 0),
    }
  })

  return {
    totalActive: outgoings.length,
    weeklyTotal,
    monthlyTotal,
    yearlyTotal,
    formattedWeeklyTotal: formatCurrency(weeklyTotal),
    formattedMonthlyTotal: formatCurrency(monthlyTotal),
    formattedYearlyTotal: formatCurrency(yearlyTotal),
    upcoming,
    monthlyTrend,
  }
}
