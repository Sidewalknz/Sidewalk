'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, updateUser } from '@/actions/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Save, User, ShieldCheck, Loader2 } from 'lucide-react'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export function UserForm({
    user,
    children,
    headerTitle,
    headerSubtitle,
    headerBackHref,
}: {
    user?: any
    children?: React.ReactNode
    headerTitle?: React.ReactNode
    headerSubtitle?: React.ReactNode
    headerBackHref?: string
}) {
    const isEditing = !!user
    const router = useRouter()
    const [tab, setTab] = useState<'profile' | 'auth'>('profile')
    const [state, action, isPending] = useActionState(
        isEditing ? updateUser : createUser,
        { message: '' }
    )

    useEffect(() => {
        if (state?.message?.includes('success')) {
            const timer = setTimeout(() => {
                router.push('/admin/users')
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [state, router])

    return (
        <form
            action={action}
            onSubmitCapture={(e) => {
                const form = e.currentTarget
                if (!form.checkValidity()) {
                    e.preventDefault()

                    const invalid = form.querySelector(':invalid') as HTMLInputElement | HTMLSelectElement | null
                    const invalidName = invalid?.name
                    if (invalidName === 'password' || invalidName === 'confirmPassword') {
                        setTab('auth')
                    } else {
                        setTab('profile')
                    }

                    requestAnimationFrame(() => form.reportValidity())
                }
            }}
            className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            {isEditing && <input type="hidden" name="id" value={user?.id} />}

            <AdminPageHeader
                title={headerTitle ?? (isEditing ? 'Edit user' : 'New user')}
                subtitle={headerSubtitle ?? (isEditing ? 'Update details and access' : 'Add a user and choose their access')}
                backHref={headerBackHref ?? '/admin/users'}
                backTitle="Back to users"
            />
            
            <AdminEditorLayout
                sidebar={
                    <div className="space-y-8">
                        <AdminEditorSidebarCard>
                            <div className="space-y-8">

                                <div className="space-y-4">
                                    <select
                                        id="role"
                                        name="role"
                                        defaultValue={user?.role || 'user'}
                                        className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest px-6 focus:ring-2 focus:ring-brand-500 cursor-pointer transition-all hover:bg-white/10 text-white"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-16 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-600/20 disabled:opacity-50"
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Save size={18} strokeWidth={3} />
                                                {isEditing ? 'Update user' : 'Create user'}
                                            </div>
                                        )}
                                    </Button>

                                    {state?.message && (
                                        <div className={cn(
                                            "p-4 rounded-2xl text-center border animate-in zoom-in-95 duration-300",
                                            state.message.includes('success')
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                {state.message.includes(':') ? state.message.split(':')[1] : state.message}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </AdminEditorSidebarCard>
                    </div>
                }
            >
                <div className="space-y-8">
                    <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
                        <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl gap-1 mb-8">
                            <TabsTrigger value="profile" className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all gap-2">
                                <User size={14} />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="auth" className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all gap-2">
                                <ShieldCheck size={14} />
                                Authentication
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent forceMount value="profile" className="space-y-10 animate-in fade-in duration-300 data-[state=inactive]:hidden">
                            <div className="rounded-[2.5rem] bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-8 space-y-8 shadow-xl shadow-slate-200/10 dark:shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        defaultValue={user?.firstName}
                                        placeholder="Jane"
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        defaultValue={user?.lastName}
                                        placeholder="Doe"
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        defaultValue={user?.email}
                                        placeholder="jane@studio.com"
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={user?.phone}
                                        placeholder="+64 ..."
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                            </div>
                            </div>
                        </TabsContent>

                        <TabsContent forceMount value="auth" className="space-y-10 animate-in fade-in duration-300 data-[state=inactive]:hidden">
                            <div className="rounded-[2.5rem] bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-8 space-y-8 shadow-xl shadow-slate-200/10 dark:shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        {isEditing ? 'New Secure Password' : 'Password'}
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required={!isEditing}
                                        placeholder={isEditing ? "(Leave blank to keep current)" : "••••••••"}
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required={!isEditing}
                                        placeholder={isEditing ? "(Optional verification)" : "••••••••"}
                                        className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                                    />
                                </div>
                            </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {children}
                </div>
            </AdminEditorLayout>
        </form>
    )
}
