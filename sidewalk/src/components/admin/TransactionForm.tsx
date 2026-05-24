'use client'

import React, { useActionState, useMemo, useState } from 'react'
import { CreditCard, Loader2, Save } from 'lucide-react'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TransactionForm({
  item,
  backHref,
  createAction,
  updateAction,
}: {
  item?: any
  backHref: string
  createAction: any
  updateAction: any
}) {
  const isEditing = Boolean(item?.id)
  const action = isEditing ? updateAction : createAction
  const [state, formAction, isPending] = useActionState(action as any, { message: '' })

  const [orderId, setOrderId] = useState<string>(() => item?.order?.id || item?.order || '')

  const jsonDefaults = useMemo(() => {
    const rawResponse = item?.rawResponse ? JSON.stringify(item.rawResponse, null, 2) : ''
    const metadata = item?.metadata ? JSON.stringify(item.metadata, null, 2) : ''
    return { rawResponse, metadata }
  }, [item])

  return (
    <form action={formAction}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminPageHeader
          title={isEditing ? 'Edit Transaction' : 'New Transaction'}
          subtitle="Standalone transaction record (manual or provider reference)"
          backHref={backHref}
          center={null}
        />

        <AdminEditorLayout
          sidebar={
            <div className="space-y-8">
              <AdminEditorSidebarCard>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Status</Label>
                    <select
                      name="status"
                      defaultValue={item?.status || 'pending'}
                      className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-black appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase tracking-widest text-white"
                    >
                      <option value="pending" className="text-slate-900 font-bold bg-white">
                        Pending
                      </option>
                      <option value="succeeded" className="text-slate-900 font-bold bg-white">
                        Succeeded
                      </option>
                      <option value="failed" className="text-slate-900 font-bold bg-white">
                        Failed
                      </option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-16 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group border-none"
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>{isEditing ? 'Save Changes' : 'Create Transaction'}</span>
                        <Save className="w-4 h-4" strokeWidth={3} />
                      </div>
                    )}
                  </Button>

                  {state?.message ? <div className="text-[11px] font-medium text-white/70">{state.message}</div> : null}
                </div>
              </AdminEditorSidebarCard>
            </div>
          }
        >
          <input type="hidden" name="id" value={item?.id || ''} />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl mb-8 gap-1">
              <TabsTrigger
                value="details"
                className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all gap-2"
              >
                <CreditCard size={14} />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="payload"
                className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all gap-2"
              >
                Payload
              </TabsTrigger>
            </TabsList>

            <TabsContent forceMount value="details" className="space-y-10 animate-in fade-in duration-300 data-[state=inactive]:hidden">
              <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl shadow-slate-200/10 dark:shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order ID</Label>
                    <Input name="order" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="orders id" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</Label>
                    <select
                      name="type"
                      defaultValue={item?.type || 'charge'}
                      className="w-full h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="charge">Charge</option>
                      <option value="refund">Refund</option>
                      <option value="void">Void</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gateway</Label>
                    <select
                      name="gateway"
                      defaultValue={item?.gateway || 'manual'}
                      className="w-full h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 transition-all"
                    >
                      <option value="manual">Manual</option>
                      <option value="stripe">Stripe</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gateway Transaction ID</Label>
                    <Input name="gatewayTransactionId" defaultValue={item?.gatewayTransactionId || ''} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</Label>
                    <Input type="number" min={0} step={0.01} name="amount" defaultValue={item?.amount ?? ''} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fee (Optional)</Label>
                    <Input type="number" min={0} step={0.01} name="fee" defaultValue={item?.fee ?? ''} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</Label>
                    <Input name="currency" defaultValue={item?.currency || 'nzd'} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent forceMount value="payload" className="space-y-10 animate-in fade-in duration-300 data-[state=inactive]:hidden">
              <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl shadow-slate-200/10 dark:shadow-none">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Raw Response (JSON)</Label>
                  <Textarea rows={8} name="rawResponse" defaultValue={jsonDefaults.rawResponse} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metadata (JSON)</Label>
                  <Textarea rows={8} name="metadata" defaultValue={jsonDefaults.metadata} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </AdminEditorLayout>
      </div>
    </form>
  )
}

