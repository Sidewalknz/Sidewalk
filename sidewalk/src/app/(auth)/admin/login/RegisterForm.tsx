'use client'

import React, { useActionState } from 'react'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFirstUser } from '@/actions/users'

export default function RegisterForm() {
    const [state, action, isPending] = useActionState(createFirstUser, { message: '' })

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <Lock className="w-8 h-8 text-brand-600" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 border-b-4 border-brand-600 pb-2 italic uppercase">
                        System Setup<span className="text-brand-600">.</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-4 font-bold">Initialize your platform administrator.</p>
                </div>

                <form action={action} className="space-y-6">
                    {state?.message && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            {state.message}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                placeholder="First Name"
                                className="rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                placeholder="Last Name"
                                className="rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                           <Input
                               id="email"
                               name="email"
                               type="email"
                               required
                               placeholder="admin@example.co.nz"
                               className="pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                           />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</Label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                           <Input
                               id="password"
                               name="password"
                               type="password"
                               required
                               placeholder="••••••••"
                               className="pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                           />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</Label>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                           <Input
                               id="confirmPassword"
                               name="confirmPassword"
                               type="password"
                               required
                               placeholder="••••••••"
                               className="pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-14"
                           />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 bg-brand-600 hover:bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-100 transition-all active:scale-95 group overflow-hidden relative"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2 translate-x-3 group-hover:translate-x-0 transition-transform duration-300">
                                Create Account <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0" />
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
