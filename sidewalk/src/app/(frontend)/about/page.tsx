import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'

export const metadata = {
  title: 'Web Agency Nelson NZ',
  description: 'Learn about Sidewalk, a Nelson NZ web agency for website design, web development, self-hosted web solutions, and practical digital systems.',
}

export default function AboutPage() {
  const team = [
    {
      name: 'Ezekiel Brown',
      role: 'Lead Developer',
      description: 'Ezekiel looks after the technical side of Sidewalk, shaping the web development, CMS architecture, and custom systems behind each project. With a Bachelor of Information Technology from NMIT and a Master of Artificial Intelligence from Victoria University of Wellington, he brings a strong technical foundation to practical, business-focused websites.',
    },
    {
      name: 'Keegan Jeffries',
      role: 'Sales, onboarding, and operations',
      description: 'Keegan keeps projects moving clearly from first enquiry to launch, managing client communication, onboarding, admin, and the practical details along the way. His work managing Kirby Lane and Bridge Street Collective brings a strong understanding of business operations and client experience.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="about"
        description="Sidewalk brings design, development, and practical web systems together to create websites that are easier to manage and built around how each business works."
        highlights={['website design', 'web development', 'web solutions', 'digital presence']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Ezekiel Brown</p>
            <p className="mt-1 text-2xl font-extrabold">Lead Developer</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Keegan Jeffries</p>
            <p className="mt-1 text-2xl font-extrabold">Sales, onboarding, and operations</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1C2830]/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
          </div>
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1C2830]">
              Design, development, and systems that connect.
            </h2>
            <p className="text-xl leading-9 text-[#1C2830]/80">
              We are a Nelson-based duo passionate about crafting websites and building brands that connect. At Sidewalk, we bring design and development together to help companies stand out online and work more efficiently behind the scenes.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/75">
              Our work sits between web design Nelson businesses can trust, custom web development Nelson companies can grow with, and practical web solutions that reduce manual admin. We care about websites that look sharp, load fast, and give businesses control over their content.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
              Why self-hosted matters
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <p className="text-xl leading-9 text-[#1C2830]/80">
              We believe in self-hosted solutions that give you complete control over your digital presence. That means your website, content, and business systems can be shaped around how you operate rather than being boxed into a one-size-fits-all platform.
            </p>
            <p className="text-lg leading-8 text-[#1C2830]/75">
              For clients looking for a website developer in Nelson NZ, this approach means cleaner ownership, better flexibility, and room to build custom workflows, booking systems, ecommerce, dashboards, and content management around the business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#1C2830]/20 pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
              The team
            </h2>
          </div>
          <div className="lg:col-span-8 divide-y divide-[#1C2830]/20">
            {team.map((member) => (
              <div key={member.name} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 first:pt-0">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#B74831]">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold uppercase tracking-normal text-[#1C2830]/60">
                    {member.role}
                  </p>
                </div>
                <p className="md:col-span-2 text-lg leading-8 text-[#1C2830]/80">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title="See what we build"
        description="Explore the website packages and custom web solutions we can shape around your brand, content, customers, and workflow."
        href="/services"
        linkLabel="View services"
      />
    </div>
  )
}
