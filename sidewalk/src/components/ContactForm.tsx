'use client';

import React, { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { sendContactEmail } from '@/actions/contact'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [startedAt] = useState(() => Date.now().toString())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await sendContactEmail(formData)
    
    setResult(response)
    setIsSubmitting(false)
    
    if (response.success) {
      (e.target as HTMLFormElement).reset()
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <input type="hidden" name="startedAt" value={startedAt} />
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 md:px-5 md:py-4"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="john@example.com"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 md:px-5 md:py-4"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="How can we help?"
            className="w-full border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 md:px-5 md:py-4"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-slate-700 dark:text-slate-300">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Your message goes here..."
            className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 md:px-5 md:py-4"
          ></textarea>
        </div>

        {result && (
          <div className={`p-4 flex items-center space-x-3 ${result.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {result.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{result.success ? 'Your message has been sent successfully!' : result.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center space-x-2 bg-brand-600 py-3.5 font-bold text-white shadow-xl shadow-brand-500/20 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 md:py-4"
        >
          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          <Send size={18} className={`${isSubmitting ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1'} transition-transform`} />
        </button>
      </form>
    </div>
  )
}
