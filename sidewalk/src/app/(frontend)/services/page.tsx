import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'

export const metadata = {
  title: 'Website Design Nelson',
  description: 'Website design Nelson, web design Nelson, web development Nelson, ecommerce websites, booking systems, and custom web solutions from Sidewalk.',
}

export default function ServicesPage() {
const packages = [
  {
    name: 'One page website',
    description:
      'A custom one page website for small businesses, campaigns, landing pages, or service-based brands that need a clear and focused online presence without a full multi page setup.',
    details: [
      'Custom one page design',
      'Responsive website build',
      'Contact form setup',
      'Basic SEO structure',
      'Fast self-hosted website',
      'Maintenance support available',
    ],
  },
  {
    name: 'Multi page website',
    description:
      'A custom multi page website for businesses that need room for services, about content, projects, FAQs, locations, resources, or stronger search coverage across multiple pages.',
    details: [
      'Custom website design',
      'Responsive website build',
      'Content management setup',
      'Flexible page structure',
      'Basic SEO structure',
      'Fast self-hosted website',
      'Maintenance support available',
    ],
  },
  {
    name: 'Ecommerce website',
    description:
      'A custom ecommerce website for selling products online, with a manageable product catalogue, clear buying flow, and room to grow. No Shopify platform fees, just standard payment processing fees such as Stripe.',
    details: [
      'Custom ecommerce design',
      'Responsive website build',
      'Product catalogue setup',
      'Checkout flow',
      'Stripe payment integration',
      'Product management setup',
      'Basic SEO structure',
      'Fast self-hosted website',
      'Maintenance support available',
    ],
  },
]

  const quotedServices = [
    'Booking systems',
    'Ticketing systems',
    'Custom dashboards',
    'Workflow automation',
    'Payload CMS builds',
    'Website rebuilds and migrations',
    'Much more!'
  ]

  return (
    <div>
      <SidewalkHero
        title="services"
        description="Every Sidewalk project is custom made. We design and develop websites around your brand, content, customers, and workflow, whether you need a simple one page website or a more complex web solution."
        highlights={['web design Nelson', 'website design Nelson', 'web development Nelson', 'ecommerce websites', 'booking systems', 'web solutions']}
      />

      <section className="bg-[#1C2830] py-24 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
            No generic templates. Everything Custom made.
          </h2>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                Website packages
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#1C2830]/75">
                Every website is scoped around the content, integrations, design complexity, and functionality required. We self-host our websites, provide maintenance support, and can help with SEO before and after launch.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 divide-y divide-[#1C2830]/20">
            {packages.map((item) => (
              <div key={item.name} className="py-10 first:pt-0">
                <div className="grid grid-cols-1 gap-4 md:items-start">
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#B74831]">
                      {item.name}
                    </h3>
                    <p className="mt-4 text-lg leading-8 text-[#1C2830]/80">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="text-lg font-bold text-[#1C2830]">
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
            <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
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

      <PageCTA
        title="Need a website?"
        description="Send through what you need built. We will help work out whether it fits a package or needs a custom quote."
        href="/contact"
        linkLabel="Ask for a quote"
      />
    </div>
  )
}
