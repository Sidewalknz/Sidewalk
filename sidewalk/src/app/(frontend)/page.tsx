import React from 'react'
import { Hero } from '@/components/frontend/Hero'
import { CheckCircle2, Layout, Zap, Smartphone } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      title: 'Modular Design',
      description: 'Plug-and-play components that work seamlessly with any Sidewalk module.',
      icon: <Layout className="text-brand-600" size={24} />,
    },
    {
      title: 'Ultra Responsive',
      description: 'Looks stunning on every device, from mobile phones to high-res monitors.',
      icon: <Smartphone className="text-brand-600" size={24} />,
    },
    {
      title: 'Performance First',
      description: 'Zero bloat, optimized assets, and lightning-fast server-side rendering.',
      icon: <Zap className="text-brand-600" size={24} />,
    },
  ]

  return (
    <div className="pb-24">
      <Hero />

      {/* Features Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-stone-300/60 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-transparent hover:border-brand-500/20 transition-all hover:shadow-2xl hover:shadow-brand-500/5">
              <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative bg-slate-900 dark:bg-white rounded-[2rem] p-8 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-8 md:space-y-0">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-slate-900 mb-4">
                Ready to transform your workflow?
              </h2>
              <p className="text-slate-400 dark:text-slate-500 text-lg">
                Join the elite developers building with Sidewalk today.
              </p>
            </div>
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/20">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
