'use client'

import { createFirstUser } from '@/actions/users'
import { useActionState } from 'react' // Changed from useFormState
import { UserPlus } from 'lucide-react'

const initialState = {
  message: '',
}

export default function CreateFirstUserForm() {
    const [state, formAction, pending] = useActionState(createFirstUser, initialState)

    return (
        <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-zinc-800 rounded-full mb-4">
                    <UserPlus className="w-6 h-6 text-zinc-400" />
                </div>
                <h1 className="text-2xl font-bold">Welcome directly to Sidewalk</h1>
                <p className="text-zinc-400 text-sm mt-2">Create your admin account to get started</p>
            </div>

            <form action={formAction} className="space-y-4">
                {state?.message && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm text-center">
                        {state.message}
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-zinc-700 outline-none transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-zinc-700 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-zinc-700 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full py-2 bg-white text-zinc-950 font-medium rounded-lg hover:bg-zinc-200 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {pending ? 'Creating Account...' : 'Create Admin Account'}
                </button>
            </form>
        </div>
    )
}
