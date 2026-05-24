import React from 'react'
import Link from 'next/link'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Website Design Nelson',
  description: 'Website design Nelson, web design Nelson, web development Nelson, ecommerce websites, booking systems, and custom web solutions from Sidewalk.',
}

export default function ServicesPage() {
  const packages = [
    {
      name: 'One page website',
      price: 'From $1,500',
      description: 'A custom one page website for small businesses, campaigns, landing pages, or service-based brands that need a clear online presence.',
      details: ['Custom design', 'Responsive build', 'Contact form', 'Basic SEO setup', 'Launch support'],
    },
    {
      name: 'Multi page website',
      price: 'From $3,500',
      description: 'A custom multi page website for businesses that need room for services, about content, projects, FAQs, and stronger search coverage.',
      details: ['Custom website design', 'CMS setup', 'Core page templates', 'On-page SEO structure', 'Training handover'],
    },
    {
      name: 'Ecommerce website',
      price: 'From $6,500',
      description: 'A custom ecommerce website for selling products online with a manageable catalogue, clear buying flow, and room to grow.',
      details: ['Product structure', 'Checkout flow', 'Payment integration', 'CMS/product management', 'Launch support'],
    },
  ]

  const quotedServices = [
    'Booking systems',
    'Ticketing systems',
    'Client portals',
    'Custom dashboards',
    'Workflow automation',
    'CRM-style tools',
    'Payload CMS builds',
    'Website rebuilds and migrations',
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="services"
        description="Custom web design Nelson, website design Nelson, web development Nelson, ecommerce websites, booking systems, and web solutions built around how your business works."
        highlights={['web design Nelson', 'website design Nelson', 'web development Nelson', 'ecommerce websites', 'booking systems', 'web solutions']}
      />

      <section className="border-t border-[#1C2830]/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-bold uppercase tracking-normal text-[#B74831]">
              Custom made
            </p>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1C2830]">
              No generic templates. No boxed-in builds.
            </h2>
            <p className="text-xl leading-9 text-[#1C2830]/80">
              Every Sidewalk project is custom made. We design and develop websites around your brand, content, customers, and workflow, whether you need a simple one page website or a more complex web solution.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C2830]">
              Website packages
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#1C2830]/75">
              Dummy pricing for now. Final pricing depends on content, integrations, design complexity, and functionality.
            </p>
          </div>
          <div className="lg:col-span-8 divide-y divide-[#1C2830]/20">
            {packages.map((item) => (
              <div key={item.name} className="py-10 first:pt-0">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:items-start">
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#B74831]">
                      {item.name}
                    </h3>
                    <p className="mt-4 text-lg leading-8 text-[#1C2830]/80">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1C2830]">
                    {item.price}
                  </p>
                </div>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="text-[#1C2830]/75">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C2830]">
              Quoted web solutions
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-xl leading-9 text-[#1C2830]/80 max-w-4xl">
              Some projects need to be scoped properly before pricing. If you need a booking system, ecommerce flow, dashboard, integration, or custom business tool, we quote based on the workflow and technical requirements.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {quotedServices.map((service) => (
                <p key={service} className="text-lg font-bold text-[#1C2830]">
                  {service}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1C2830]/20 pt-16">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1C2830]">
              Need a website developer in Nelson NZ?
            </h2>
            <p className="text-xl leading-9 text-[#1C2830]/80">
              Send through what you need built. We will help work out whether it fits a package or needs a custom quote.
            </p>
            <Link href="/contact" className="inline-flex text-lg font-extrabold text-[#B74831] hover:text-[#1C2830] transition-colors">
              Ask for a quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
