'use client'

import React from 'react'
import Link from 'next/link'
import { Rocket, ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32 bg-white dark:bg-slate-950">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-12 flex justify-center">
          <div className="absolute inset-0 bg-brand-500/10 blur-[100px] rounded-full" />
          <div className="relative bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <Search size={64} className="text-brand-600 animate-pulse" />
            <div className="absolute -top-4 -right-4 bg-brand-600 text-white p-3 rounded-2xl shadow-lg rotate-12">
              <span className="font-bold text-xl">404</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Lost in <span className="text-brand-600">Space?</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-lg mx-auto">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center space-x-2 group"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Link */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Think this is a mistake? <Link href="/contact" className="text-brand-600 font-semibold hover:underline">Let us know</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
