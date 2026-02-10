'use client'

import React, { useActionState } from 'react'
import { OngoingExpense } from '@/payload-types'

interface ExpenseFormProps {
  initialData?: OngoingExpense
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>
  mode: 'create' | 'edit'
}

const initialState = {
  message: '',
}

export default function ExpenseForm({ initialData, action, mode }: ExpenseFormProps) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{mode === 'create' ? 'Add New Expense' : 'Edit Expense'}</h2>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.message && (
             <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                 {state.message}
             </div>
        )}
        
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Expense Name</label>
              <input name="name" defaultValue={initialData?.name} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-2 text-zinc-500">$</span>
                    <input name="amount" type="number" step="0.01" defaultValue={initialData?.amount} required className="w-full pl-8 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Frequency</label>
                <select name="frequency" defaultValue={initialData?.frequency || 'monthly'} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Start Date</label>
              <input name="startDate" type="date" defaultValue={initialData?.startDate ? initialData.startDate.split('T')[0] : ''} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Category</label>
              <input name="category" defaultValue={initialData?.category || ''} placeholder="e.g. Hosting, Software" className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Notes</label>
              <textarea name="notes" defaultValue={initialData?.notes || ''} rows={3} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData?.isActive !== false} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-blue-500 focus:ring-blue-500/20" />
                <label htmlFor="isActive" className="text-sm font-medium text-zinc-400">Active Expense</label>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
           {/* Can add back button manually in parent */}
           <button type="submit" className="px-6 py-2 bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 font-medium transition-colors">
              {mode === 'create' ? 'Create Expense' : 'Update Expense'}
           </button>
        </div>
      </form>
    </div>
  )
}
