'use client'

import React, { useActionState } from 'react'
import { User } from '@/payload-types'

interface UserFormProps {
  initialData?: User
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>
  mode: 'create' | 'edit'
}

const initialState = {
  message: '',
}

export default function UserForm({ initialData, action, mode }: UserFormProps) {
  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{mode === 'create' ? 'Add New User' : 'Edit User'}</h2>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.message && (
             <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                 {state.message}
             </div>
        )}
        
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
          <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Account Information</h3>
          
          <div className="space-y-4">
            {mode === 'edit' && (
                <input type="hidden" name="id" value={initialData?.id} />
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email</label>
              <input 
                name="email" 
                type="email" 
                defaultValue={initialData?.email} 
                required 
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">
                        {mode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <input 
                        name="password" 
                        type="password" 
                        required={mode === 'create'}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Confirm Password</label>
                    <input 
                        name="confirmPassword" 
                        type="password" 
                        required={mode === 'create'}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    />
                </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
           <button type="submit" className="px-6 py-2 bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 font-medium transition-colors">
              {mode === 'create' ? 'Create User' : 'Update User'}
           </button>
        </div>
      </form>
    </div>
  )
}
