'use client'

import React, { useTransition, useState } from 'react'
import { updateSelf } from '@/actions/users'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Save } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const { theme, setTheme } = useTheme()

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateSelf(formData)
      if (result.message === 'Success') {
        setMessage({ type: 'success', text: 'Account updated.' })
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminEditorLayout
        sidebar={
          <div className="space-y-8">
            <AdminEditorSidebarCard>
              <div className="space-y-6">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-16 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group border-none"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Save changes</span>
                      <Save className="w-4 h-4" strokeWidth={3} />
                    </div>
                  )}
                </Button>

                {message ? (
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border animate-in zoom-in-95 duration-300",
                      message.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    )}
                  >
                    {message.text}
                  </div>
                ) : null}

                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">
                  Changes apply immediately.
                </p>
              </div>
            </AdminEditorSidebarCard>
          </div>
        }
      >
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                required
                className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  New password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold pl-1">
              Leave the password fields blank to keep your current password.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-4 block">Appearance</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'light', name: 'Light' },
                { id: 'dark', name: 'Dark' },
                { id: 'system', name: 'System' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTheme(mode.id)}
                  className={cn(
                    "h-14 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest",
                    theme === mode.id
                      ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-400'
                  )}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AdminEditorLayout>
    </form>
  )
}

