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
        
        <div className="p-6 rounded-xl border space-y-6 shadow-sm"
             style={{ 
                 backgroundColor: 'var(--admin-sidebar-bg)', 
                 borderColor: 'var(--admin-sidebar-border)' 
             }}>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Expense Name</label>
              <input name="name" defaultValue={initialData?.name} required 
                     className="w-full px-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                     style={{ 
                         backgroundColor: 'var(--admin-bg)', 
                         borderColor: 'var(--admin-sidebar-border)',
                         color: 'var(--admin-text)',
                         borderWidth: '1px'
                     }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-2 text-zinc-500">$</span>
                    <input name="amount" type="number" step="0.01" defaultValue={initialData?.amount} required 
                           className="w-full pl-8 pr-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                           style={{ 
                               backgroundColor: 'var(--admin-bg)', 
                               borderColor: 'var(--admin-sidebar-border)',
                               color: 'var(--admin-text)',
                               borderWidth: '1px'
                           }}
                    />
                </div>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Frequency</label>
                <select name="frequency" defaultValue={initialData?.frequency || 'monthly'} required 
                        className="w-full px-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                        style={{ 
                             backgroundColor: 'var(--admin-bg)', 
                             borderColor: 'var(--admin-sidebar-border)',
                             color: 'var(--admin-text)',
                             borderWidth: '1px'
                         }}
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Start Date</label>
              <input name="startDate" type="date" defaultValue={initialData?.startDate ? initialData.startDate.split('T')[0] : ''} required 
                     className="w-full px-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                     style={{ 
                         backgroundColor: 'var(--admin-bg)', 
                         borderColor: 'var(--admin-sidebar-border)',
                         color: 'var(--admin-text)',
                         borderWidth: '1px'
                     }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Category</label>
              <input name="category" defaultValue={initialData?.category || ''} placeholder="e.g. Hosting, Software" 
                     className="w-full px-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                     style={{ 
                         backgroundColor: 'var(--admin-bg)', 
                         borderColor: 'var(--admin-sidebar-border)',
                         color: 'var(--admin-text)',
                         borderWidth: '1px'
                     }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Notes</label>
              <textarea name="notes" defaultValue={initialData?.notes || ''} rows={3} 
                        className="w-full px-4 py-2 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20" 
                        style={{ 
                             backgroundColor: 'var(--admin-bg)', 
                             borderColor: 'var(--admin-sidebar-border)',
                             color: 'var(--admin-text)',
                             borderWidth: '1px'
                         }}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData?.isActive !== false} 
                       className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500/20" 
                       style={{ 
                            backgroundColor: 'var(--admin-bg)', 
                            borderColor: 'var(--admin-sidebar-border)',
                        }}
                />
                <label htmlFor="isActive" className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Active Expense</label>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-4" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
           {/* Can add back button manually in parent */}
           <button type="submit" 
                   className="px-6 py-2 rounded-lg font-medium transition-colors"
                   style={{ 
                       backgroundColor: 'var(--admin-text)', 
                       color: 'var(--admin-bg)' 
                   }}>
              {mode === 'create' ? 'Create Expense' : 'Update Expense'}
           </button>
        </div>
      </form>
    </div>
  )
}
