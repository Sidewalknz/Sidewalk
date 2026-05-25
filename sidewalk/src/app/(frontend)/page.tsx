import React from 'react'
import Link from 'next/link'
import { Hero } from '@/components/frontend/Hero'
import { ClientMarquee } from '@/components/frontend/ClientMarquee'
import { JourneyHeading } from '@/components/frontend/JourneyHeading'
import { ServiceStickyMenu } from '@/components/frontend/ServiceStickyMenu'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const services = [
    {
      title: 'Website design and development',
      text: 'We design and build websites that are easy to use, easy to update, and tailored to the way your business works. From simple pages to more advanced web features, the goal is always to make the site useful, clear, and built properly.',
    },
    {
      title: 'Content management',
      text: 'We build custom content management systems around the content your business actually needs to update. Using Payload CMS, we create tailored admin areas for things like menus, products, projects, events, blogs, team members, and other dynamic content, so you can keep your website up to date without touching the design or code.',
    },
    {
      title: 'SEO',
      text: 'Good SEO starts before the site goes live. We plan the structure, pages, metadata, content flow, and technical basics so your website has a stronger chance of showing up for the right local searches.',
    },
    {
      title: 'UI/UX design',
      text: 'Your website should feel like it belongs to your brand. We take cues from your existing branding, products, packaging, signage, or style guide, then design clear, easy-to-use interfaces that fit naturally into the rest of your business.',
    },
    {
      title: 'Web solutions',
      text: 'Some businesses need more than a standard website. We build practical web solutions like quote forms, booking flows, email automation, dashboards, integrations, client portals, and custom tools that help reduce manual admin and make day-to-day work easier.',
    },
  ]

  const process = [
    {
      title: 'Understand the work',
      text: 'We start by learning how the business works, who the website is for, what content matters, and where the current digital experience is slowing things down.',
    },
    {
      title: 'Map the structure',
      text: 'Before design starts, we plan the page structure, user journey, content hierarchy, CMS needs, integrations, and technical requirements so the project has a clear shape.',
    },
    {
      title: 'Design with purpose',
      text: 'The design phase turns that plan into clear layouts, reusable sections, and practical interfaces that fit the brand while staying easy for customers and staff to use.',
    },
    {
      title: 'Build for handover',
      text: 'We build the website with manageable content, sensible admin tools, and room to grow, then refine and support it so it keeps working after launch.',
    },
  ]

  return (
    <div className="pb-24">
      <Hero />
      <ClientMarquee />

      <section id="home-content" className="home-journey-section scroll-mt-24">
        <div className="home-journey-section__inner">
          <JourneyHeading top="WEBSITES" bottom="WORK HARDER" reveal="should" />
          <div className="home-journey-copy">
            <h2 className="sr-only">Websites should do more than sit online</h2>
            <p className="text-xl leading-9 text-[#1C2830]/80 max-w-4xl">
              Sidewalk is a Nelson web agency creating website design, web development, and web solutions for businesses that need a site they can use, manage, and build on.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/75 max-w-4xl">
              That can mean a sharper marketing website, a better content management setup, a custom workflow, or a digital system that removes manual admin from the business.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="home-journey-section home-services-section scroll-mt-24">
        <div className="home-journey-section__inner">
          <JourneyHeading top="WHAT" bottom="MATTERS" reveal="we build" exitLeftAt={0.08} />
          <div className="home-journey-copy">
            <h2 className="sr-only">What we build</h2>
            <ServiceStickyMenu services={services} />
          </div>
        </div>
      </section>

      <section className="home-journey-section home-services-section">
        <div className="home-journey-section__inner">
          <JourneyHeading top="PLANNING" bottom="CLEARER PROJECTS" reveal="creates" exitLeftAt={0.08} />
          <div className="home-journey-copy">
            <h2 className="sr-only">How we work</h2>
            <ServiceStickyMenu services={process} reverse />
          </div>
        </div>
      </section>

      <section className="home-journey-section">
        <div className="home-journey-section__inner">
          <JourneyHeading top="RIGHT FIT" bottom="BETTER WORK" reveal="creates" />
          <div className="home-journey-copy">
            <h2 className="sr-only">A good fit when</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
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
        </div>
      </section>

      <section className="home-journey-section">
        <div className="home-journey-section__inner">
          <JourneyHeading top="START" bottom="CONVERSATION" reveal="with a" />
          <div className="home-journey-copy">
            <h2 className="sr-only">Planning a website or web system</h2>
            <p className="text-xl leading-9 text-[#1C2830]/80 max-w-4xl">
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
