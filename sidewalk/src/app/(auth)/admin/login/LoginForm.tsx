'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

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
                setError('Invalid email or password. Please try again.')
            }
        } catch (err) {
            setError('An error occurred. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Lock className="w-8 h-8 text-brand-600" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 border-b-4 border-brand-600 pb-2">
                        Admin Login
                    </h1>
                    <p className="text-slate-500 text-sm mt-4 font-medium">Control your platform with precision.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</Label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                           <Input
                               id="email"
                               type="email"
                               required
                               placeholder="admin@example.com"
                               className="pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                           />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</Label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                           <Input
                               id="password"
                               type="password"
                               required
                               placeholder="••••••••"
                               className="pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                           />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-brand-600 hover:bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-100 transition-all active:scale-95 group overflow-hidden relative"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2 translate-x-3 group-hover:translate-x-0 transition-transform duration-300">
                                Sign In <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-10 text-center">
                   <p className="text-xs text-slate-400 font-medium">
                      Need help? <a href="mailto:admin@sidewalks.co.nz" className="text-brand-600 hover:underline">Contact Support</a>
                   </p>
                </div>
            </div>
            
            <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
               © 2026 Powered by Sidewalk
            </p>
        </div>
    )
}
