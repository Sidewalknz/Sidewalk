import React from 'react'
import { ContactForm } from '@/components/ContactForm'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'

export const metadata = {
  title: 'Contact a Web Designer Nelson NZ',
  description: 'Contact Sidewalk, a web designer and website developer in Nelson NZ for web design, website design, and web development projects.',
}

export default function ContactPage() {
  const contactInfo = [
    { label: 'Email', value: 'admin@sidewalk.co.nz' },
    { label: 'Location', value: 'Nelson, New Zealand' },
  ]

  const services = [
    {
      name: 'One page website',
      description: 'A focused custom website for small businesses, campaigns, landing pages, or service-based brands that need a clear online presence.',
    },
    {
      name: 'Multi page website',
      description: 'A broader website for businesses that need room for services, about content, projects, FAQs, stronger search coverage, and CMS editing.',
    },
    {
      name: 'Ecommerce website',
      description: 'A custom online store with product structure, payment integration, CMS/product management, and a clear buying flow.',
    },
    {
      name: 'Quoted web solutions',
      description: 'Booking systems, ticketing, client portals, dashboards, workflow automation, Payload CMS builds, integrations, and rebuilds.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="Contact"
        description="Talk to us about your next website, ecommerce store, booking system, or custom web project."
        highlights={['us', 'website', 'custom web project']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {contactInfo.map((info) => (
            <div key={info.label} className="border-l border-white/20 pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">{info.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{info.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Column: Form */}
            <div className="order-2 lg:order-1">
              <div className="lg:sticky lg:top-28">
                <div className="mb-12">
                  <h2 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-6xl">
                    Let's <span className="text-brand-600">Connect</span>
                  </h2>
                </div>

                <ContactForm />
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="order-1 lg:order-2">
              <div className="h-full border-l border-[#B74831]/70 pl-6 sm:pl-8 lg:pl-12">
                <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                  Services
                </h2>
                <div className="mt-10 divide-y divide-[#1C2830]/15">
                  {services.map((service) => (
                    <div key={service.name} className="py-7 first:pt-0 last:pb-0">
                      <h3 className="text-3xl font-extrabold leading-tight text-[#B74831] md:text-4xl">
                        {service.name}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-[#1C2830]/75">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        title="See what Sidewalk builds"
        description="Browse recent projects to get a feel for the websites, systems, and custom web solutions we create for clients."
        href="/portfolio"
        linkLabel="View projects"
      />
    </div>
  )
}
