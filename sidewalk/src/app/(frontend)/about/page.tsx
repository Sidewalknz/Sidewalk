import React from 'react'
import { Users, Globe, Award, ShieldCheck } from 'lucide-react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Web Agency Nelson NZ',
  description: 'Learn about Sidewalk, a Nelson NZ web agency for website design, web development, and practical web solutions for local businesses.',
}

export default function AboutPage() {
  const stats = [
    { label: 'Built with Payload', value: 'V3' },
    { label: 'Responsive Components', value: '50+' },
    { label: 'Deploy Speed', value: 'Instant' },
  ]

  const values = [
    {
      title: 'Our Mission',
      description: 'To provide the community with the highest quality, most modular Payload templates available.',
      icon: <Globe className="text-brand-600" size={24} />,
    },
    {
      title: 'Performance First',
      description: 'Every line of code is written with speed and scalability in mind.',
      icon: <Award className="text-brand-600" size={24} />,
    },
    {
      title: 'Zero Security Risk',
      description: 'Built on top of Payload’s robust authentication and security layer.',
      icon: <ShieldCheck className="text-brand-600" size={24} />,
    },
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="about"
        description="A web agency in Nelson NZ creating website design, web development, and practical web solutions with strategy, clean design, and reliable content systems."
      />

      {/* Stats */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, i) => (
            <div key={i} className="p-8 border border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="mb-6">{value.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full mb-8">
          <Users size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">Join our community</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Building the future of the web, together.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          Sidewalk is more than just a template—it's a philosophy of building modular, 
          resilient, and beautiful software.
        </p>
      </section>
    </div>
  )
}
