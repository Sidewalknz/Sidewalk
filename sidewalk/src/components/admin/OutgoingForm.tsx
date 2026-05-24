'use client'

import React, { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createOutgoing, updateOutgoing } from '@/actions/outgoings'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Loader2, Save } from 'lucide-react'

function dateValue(raw?: string | null) {
  if (!raw) return ''
  return String(raw).slice(0, 10)
}

export function OutgoingForm({ outgoing }: { outgoing?: any }) {
  const isEditing = Boolean(outgoing?.id)
  const router = useRouter()
  const action = isEditing ? updateOutgoing : createOutgoing
  const [state, formAction, isPending] = useActionState(action as any, { message: '' })

  useEffect(() => {
    if (!state?.message?.includes('success')) return
    const t = setTimeout(() => router.push('/admin/outgoings'), 900)
    return () => clearTimeout(t)
  }, [state, router])

  const stateTone =
    state?.message?.includes('success')
      ? 'text-emerald-600 dark:text-emerald-400'
      : state?.message?.includes('error')
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  return (
    <form action={formAction} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input type="hidden" name="id" value={outgoing?.id || ''} />

      <AdminEditorLayout
        leftClassName="bg-transparent border-none shadow-none p-0"
        sidebar={
          <AdminEditorSidebarCard>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="status" className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={outgoing?.status || 'active'}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-black appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase tracking-widest text-white"
                >
                  <option value="active" className="text-slate-900 font-bold bg-white">
                    Active
                  </option>
                  <option value="paused" className="text-slate-900 font-bold bg-white">
                    Paused
                  </option>
                  <option value="ended" className="text-slate-900 font-bold bg-white">
                    Ended
                  </option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-16 rounded-[1.5rem] bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-600/20 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-3">
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <Save size={18} strokeWidth={3} />
                    {isEditing ? 'Update' : 'Create'}
                  </span>
                )}
              </Button>

              {state?.message ? (
                <div className={cn('text-[10px] font-black uppercase tracking-widest ml-1', stateTone)}>
                  {state.message.replace(/^success:\s*/i, '').replace(/^error:\s*/i, '')}
                </div>
              ) : null}
            </div>
          </AdminEditorSidebarCard>
        }
      >
        <Card className="border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-10">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="flex flex-wrap justify-center w-full h-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl gap-1">
                <TabsTrigger
                  value="details"
                  className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent forceMount value="details" className="pt-8 space-y-8 data-[state=inactive]:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                      Outgoing name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={outgoing?.name || ''}
                      placeholder="e.g. Xero subscription"
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="category" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={outgoing?.category || ''}
                      placeholder="Software, rent, contractors..."
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="amount" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={outgoing?.amount ?? ''}
                      placeholder="0.00"
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="frequency" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                      Frequency
                    </Label>
                    <select
                      id="frequency"
                      name="frequency"
                      defaultValue={outgoing?.frequency || 'monthly'}
                      className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-4 text-sm font-black appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase tracking-widest text-slate-900 dark:text-white"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="startDate" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                      Start date
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={dateValue(outgoing?.startDate)}
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent forceMount value="notes" className="pt-8 space-y-8 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label htmlFor="adminNotes" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                    Admin notes
                  </Label>
                  <Textarea
                    id="adminNotes"
                    name="adminNotes"
                    defaultValue={outgoing?.adminNotes || ''}
                    placeholder="Internal notes..."
                    className="min-h-52 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AdminEditorLayout>
    </form>
  )
}
