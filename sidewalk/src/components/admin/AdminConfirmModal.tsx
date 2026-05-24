'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ShieldAlert } from 'lucide-react'

type Variant = 'warning' | 'danger' | 'brand'

const variantClasses: Record<Variant, { iconBg: string; iconText: string; button: string; ring: string }> = {
  warning: {
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700',
    ring: 'focus:ring-amber-500/40',
  },
  danger: {
    iconBg: 'bg-rose-500/10',
    iconText: 'text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700',
    ring: 'focus:ring-rose-500/40',
  },
  brand: {
    iconBg: 'bg-brand-600/10',
    iconText: 'text-brand-600',
    button: 'bg-brand-600 hover:bg-brand-700',
    ring: 'focus:ring-brand-500/40',
  },
}

export function AdminConfirmModal({
  open,
  onOpenChange,
  title,
  subtitle,
  contextLabel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmPhrase,
  confirmPhraseLabel,
  confirmPhrasePlaceholder,
  message,
  pending,
  onConfirm,
  variant = 'warning',
  icon,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  contextLabel?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmPhrase?: string
  confirmPhraseLabel?: string
  confirmPhrasePlaceholder?: string
  message?: string | null
  pending?: boolean
  onConfirm: () => void
  variant?: Variant
  icon?: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [typed, setTyped] = useState('')

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!open) return
    setTyped('')
  }, [open])

  const normalizedTyped = useMemo(() => String(typed || '').trim().toUpperCase(), [typed])
  const normalizedPhrase = useMemo(() => (confirmPhrase ? String(confirmPhrase).trim().toUpperCase() : ''), [confirmPhrase])
  const requiresPhrase = Boolean(normalizedPhrase)
  const phraseOk = !requiresPhrase || normalizedTyped === normalizedPhrase

  if (!open || !mounted) return null

  const v = variantClasses[variant]
  const Icon = icon ?? <ShieldAlert className="w-6 h-6" />

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => (pending ? null : onOpenChange(false))}
        aria-label="Close dialog"
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${v.iconBg} ${v.iconText} flex items-center justify-center shrink-0`}>
            {Icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirmation</p>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-1">{title}</h3>
            {subtitle ? (
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
            ) : null}
            {contextLabel ? (
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-3 truncate">{contextLabel}</p>
            ) : null}
          </div>
        </div>

        <div className="p-8 space-y-5">
          {requiresPhrase ? (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                {confirmPhraseLabel || `Type ${normalizedPhrase} to confirm`}
              </label>
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={confirmPhrasePlaceholder || normalizedPhrase}
                disabled={pending}
                autoFocus
                className={`w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold tracking-widest uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${v.ring}`}
              />
            </div>
          ) : null}

          {message ? (
            <div className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {message}
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={pending}
            className="h-11 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={Boolean(pending) || !phraseOk}
            className={`h-11 px-5 rounded-2xl ${v.button} text-white font-black text-xs uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

