import React from 'react'
import Link from 'next/link'
import { Hero } from '@/components/frontend/Hero'
import { ClientMarquee } from '@/components/frontend/ClientMarquee'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const services = [
    {
      title: 'Website design',
      text: 'Clear, responsive website design for Nelson businesses that need a professional presence without unnecessary clutter.',
    },
    {
      title: 'Web development',
      text: 'Frontend and backend development for fast websites, custom features, booking flows, dashboards, and business tools.',
    },
    {
      title: 'Content management',
      text: 'Practical CMS setups that let you update pages, projects, media, and structured content without relying on a developer for every change.',
    },
    {
      title: 'Web solutions',
      text: 'Digital systems that connect the website to the way your business works, from forms and email to workflows and automation.',
    },
  ]

  const process = [
    'Understand the business, customers, content, and workflow behind the website.',
    'Map the structure, user journey, and technical requirements before design starts.',
    'Design and build a fast, manageable website with room to grow.',
    'Launch, refine, and support the site so it keeps working after it goes live.',
  ]

  return (
    <div className="pb-24">
      <Hero />
      <ClientMarquee />

      <section id="home-content" className="border-t border-[#1C2830]/20 py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-bold uppercase tracking-normal text-[#B74831]">
              Web agency Nelson NZ
            </p>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1C2830]">
              Websites should do more than sit online.
            </h2>
            <p className="text-xl leading-9 text-[#1C2830]/80 max-w-4xl">
              Sidewalk is a Nelson web agency creating website design, web development, and web solutions for businesses that need a site they can use, manage, and build on.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/75 max-w-4xl">
              That can mean a sharper marketing website, a better content management setup, a custom workflow, or a digital system that removes manual admin from the business.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C2830]">
                What we build
              </h2>
            </div>
            <div className="lg:col-span-8 divide-y divide-[#1C2830]/20">
              {services.map((service) => (
                <div key={service.title} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 first:pt-0">
                  <h3 className="text-2xl font-extrabold text-[#B74831]">
                    {service.title}
                  </h3>
                  <p className="md:col-span-2 text-lg leading-8 text-[#1C2830]/80">
                    {service.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C2830]">
              How we work
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ol className="divide-y divide-[#1C2830]/20">
              {process.map((step, index) => (
                <li key={step} className="grid grid-cols-[4rem_1fr] gap-6 py-7 first:pt-0">
                  <span className="text-sm font-extrabold text-[#B74831]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xl leading-8 text-[#1C2830]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1C2830]">
              A good fit when
            </h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <p className="text-lg leading-8 text-[#1C2830]/80">
              You need a web designer in Nelson NZ who can think beyond the surface of the page.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/80">
              You want a website developer in Nelson NZ who can connect design, content, and technical delivery.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/80">
              Your current website is hard to update, slow to change, or disconnected from your workflow.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/80">
              You want practical web development that supports how the business works day to day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1C2830]/20 pt-16">
          <div className="max-w-4xl space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1C2830]">
              Planning a website or web system?
            </h2>
            <p className="text-xl leading-9 text-[#1C2830]/80">
              Tell us what you are trying to improve. We will help clarify the right approach before anything gets designed or built.
            </p>
            <Link
              href="/contact"
              className="inline-flex text-lg font-extrabold text-[#B74831] hover:text-[#1C2830] transition-colors"
            >
              Start the conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
