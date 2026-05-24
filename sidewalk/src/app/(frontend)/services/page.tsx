import React from 'react'
import { Code2, Database, Palette, Workflow } from 'lucide-react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Website Design Nelson',
  description: 'Website design Nelson, web design Nelson, web development Nelson, and digital systems from Sidewalk, a Nelson NZ web agency.',
}

export default function ServicesPage() {
  const services = [
    {
      title: 'Web Design Nelson',
      description: 'Clear, responsive web design for Nelson businesses, shaped around your brand, content, and customer journey.',
      icon: <Palette className="text-brand-600" size={24} />,
    },
    {
      title: 'Web Development Nelson',
      description: 'Modern frontend and backend web development for fast, maintainable websites and applications.',
      icon: <Code2 className="text-brand-600" size={24} />,
    },
    {
      title: 'Website Design Nelson',
      description: 'Website design and CMS builds that make editing content, media, and structured data practical.',
      icon: <Database className="text-brand-600" size={24} />,
    },
    {
      title: 'Website Developer Nelson NZ',
      description: 'Custom digital systems, integrations, and automation from a website developer in Nelson NZ.',
      icon: <Workflow className="text-brand-600" size={24} />,
    },
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="services"
        description="Web design Nelson, website design Nelson, web development Nelson, and practical web solutions for businesses that need more than a brochure website."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.title} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {service.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
