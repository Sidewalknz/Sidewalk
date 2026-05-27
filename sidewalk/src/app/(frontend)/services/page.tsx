import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'
import { Reveal } from '@/components/frontend/Reveal'

export const metadata = {
  title: 'Website Design Nelson',
  description:
    'Website design Nelson, web design Nelson, web development Nelson, ecommerce websites, booking systems, and custom web solutions from Sidewalk.',
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
    'Much more!',
  ]

  return (
    <div>
      <SidewalkHero
        title="Services"
        description="Every Sidewalk project is custom made. We design and develop websites around your brand, content, customers, and workflow, whether you need a simple one page website or a more complex web solution."
        highlights={[
          'custom websites',
          'your brand',
          'customers',
          'workflow',
          'ecommerce websites',
          'booking systems',
        ]}
      />

      <section className="bg-[#1C2830] py-14 text-white md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-tight md:text-6xl">
              No generic templates. Everything Custom made.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 md:gap-12 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                Website packages
              </h2>
              <p className="mt-4 text-base leading-7 text-[#1C2830]/75 md:mt-6 md:text-lg md:leading-8">
                Every website is scoped around the content, integrations, design complexity, and
                functionality required. We self-host our websites, provide maintenance support, and
                can help with SEO before and after launch.
              </p>
            </div>
          </Reveal>
          <div className="lg:col-span-8 divide-y divide-[#1C2830]/20">
            {packages.map((item, index) => (
              <Reveal key={item.name} delay={100 + index * 100} className="py-8 first:pt-0 md:py-10">
                <div className="grid grid-cols-1 gap-3 md:gap-4 md:items-start">
                  <div>
                    <h3 className="text-2xl font-extrabold leading-tight text-[#B74831] md:text-3xl">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#1C2830]/80 md:mt-4 md:text-lg md:leading-8">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8 md:mt-6 md:gap-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="text-base font-bold leading-7 text-[#1C2830] md:text-lg">
                      {detail}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 border-t border-[#1C2830]/20 px-4 pt-12 sm:px-6 md:gap-12 md:pt-16 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-4">
            <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
              Quoted web solutions
            </h2>
          </Reveal>
          <div className="lg:col-span-8">
            <Reveal delay={100}>
              <p className="max-w-4xl text-lg leading-8 text-[#1C2830]/80 md:text-xl md:leading-9">
                Some projects need to be scoped properly before pricing. If you need a booking
                system, ecommerce flow, dashboard, integration, or custom business tool, we quote
                based on the workflow and technical requirements.
              </p>
            </Reveal>
            <div className="mt-7 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-12 md:mt-10 md:gap-y-4">
              {quotedServices.map((service, index) => (
                <Reveal key={service} delay={200 + index * 50}>
                  <p className="text-base font-bold leading-7 text-[#1C2830] md:text-lg">{service}</p>
                </Reveal>
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
