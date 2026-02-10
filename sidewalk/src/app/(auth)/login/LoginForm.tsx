'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                if (data.user) {
                    router.push('/admin')
                    router.refresh()
                }
            } else {
                setError('Invalid email or password')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-zinc-800 rounded-full mb-4">
                    <Lock className="w-6 h-6 text-zinc-400" />
                </div>
                <h1 className="text-2xl font-bold">Sidewalk Admin</h1>
                <p className="text-zinc-400 text-sm mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm text-center">
                        {error}
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-zinc-700 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-white/10 focus:border-zinc-700 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-white text-zinc-950 font-medium rounded-lg hover:bg-zinc-200 transition-colors mt-6"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}
