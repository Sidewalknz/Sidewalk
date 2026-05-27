import React from 'react'
import { ContactForm } from '@/components/ContactForm'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'
import { Reveal } from '@/components/frontend/Reveal'

export const metadata = {
  title: 'Contact a Web Designer Nelson NZ',
  description:
    'Contact Sidewalk, a web designer and website developer in Nelson NZ for web design, website design, and web development projects.',
}

export default function ContactPage() {
  const contactInfo = [
    { label: 'Email', value: 'admin@sidewalk.co.nz' },
    { label: 'Location', value: 'Nelson, New Zealand' },
  ]

  const services = [
    {
      name: 'One page website',
      description:
        'A focused custom website for small businesses, campaigns, landing pages, or service-based brands that need a clear online presence.',
    },
    {
      name: 'Multi page website',
      description:
        'A broader website for businesses that need room for services, about content, projects, FAQs, stronger search coverage, and CMS editing.',
    },
    {
      name: 'Ecommerce website',
      description:
        'A custom online store with product structure, payment integration, CMS/product management, and a clear buying flow.',
    },
    {
      name: 'Quoted web solutions',
      description:
        'Booking systems, ticketing, client portals, dashboards, workflow automation, Payload CMS builds, integrations, and rebuilds.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="Contact"
        description="Talk to us about your next website, ecommerce store, booking system, or custom web project."
        highlights={['us', 'website', 'custom web project']}
      />

      <section className="bg-[#1C2830] py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {contactInfo.map((info, index) => (
            <Reveal key={info.label} delay={100 + index * 100}>
              <div className="border-l border-white/20 pl-5 md:pl-6">
                <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                  {info.label}
                </p>
                <p className="mt-1 text-xl font-extrabold leading-tight md:text-2xl">
                  {info.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Column: Form */}
            <Reveal className="order-2 lg:order-1">
              <div className="lg:sticky lg:top-28">
                <div className="mb-8 md:mb-12">
                  <h2 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-6xl">
                    Let's <span className="text-brand-600">Connect</span>
                  </h2>
                </div>

                <ContactForm />
              </div>
            </Reveal>

            {/* Right Column: Info */}
            <Reveal className="order-1 lg:order-2" delay={100}>
              <div className="h-full border-l border-[#B74831]/70 pl-5 sm:pl-8 lg:pl-12">
                <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                  Services
                </h2>
                <div className="mt-7 divide-y divide-[#1C2830]/15 md:mt-10">
                  {services.map((service, index) => (
                    <Reveal
                      key={service.name}
                      delay={200 + index * 75}
                      className="py-6 first:pt-0 last:pb-0 md:py-7"
                    >
                      <h3 className="text-2xl font-extrabold leading-tight text-[#B74831] md:text-4xl">
                        {service.name}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-[#1C2830]/75 md:mt-4">
                        {service.description}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
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
