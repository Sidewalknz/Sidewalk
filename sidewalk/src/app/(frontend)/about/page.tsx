import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'
import { PageCTA } from '@/components/frontend/PageCTA'
import { Reveal } from '@/components/frontend/Reveal'

export const metadata = {
  title: 'Web Agency Nelson NZ',
  description:
    'Learn about Sidewalk, a Nelson NZ web agency for website design, web development, self-hosted web solutions, and practical digital systems.',
}

export default function AboutPage() {
  const team = [
    {
      name: 'Ezekiel Brown',
      role: 'Lead Developer',
      description:
        'Ezekiel looks after the technical side of Sidewalk, shaping the web development, CMS architecture, and custom systems behind each project. With a Bachelor of Information Technology from NMIT and a Master of Artificial Intelligence from Victoria University of Wellington, he brings a strong technical foundation to practical, business-focused websites.',
    },
    {
      name: 'Keegan Jeffries',
      role: 'Sales, onboarding, and operations',
      description:
        'Keegan keeps projects moving clearly from first enquiry to launch, managing client communication, onboarding, admin, and the practical details along the way. His work managing Kirby Lane and Bridge Street Collective brings a strong understanding of business operations and client experience.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="About"
        description="Sidewalk brings design, development, and practical web systems together to create websites that are easier to manage and built around how each business works."
        highlights={[
          'design',
          'development',
          'practical web systems',
          'easier to manage',
          'how each business works',
        ]}
      />

      <section className="bg-[#1C2830] py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal delay={100}>
            <div className="border-l border-white/20 pl-5 md:pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                Ezekiel Brown
              </p>
              <p className="mt-1 text-xl font-extrabold leading-tight md:text-2xl">Lead Developer</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="border-l border-white/20 pl-5 md:pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                Keegan Jeffries
              </p>
              <p className="mt-1 text-xl font-extrabold leading-tight md:text-2xl">
                Sales, onboarding, and operations
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[#1C2830]/20 py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 md:space-y-8">
            <Reveal>
              <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                Design, development, and systems that connect.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-lg leading-8 text-[#1C2830]/80 md:text-xl md:leading-9">
                Sidewalk is a small studio that brings design, development, and day-to-day business
                thinking into the same process. We build websites that look considered, feel easy to
                use, and are backed by systems that make content and admin simpler to manage.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg leading-8 text-[#1C2830]/75">
                We care about the practical details as much as the visual ones: clear page
                structure, fast loading, flexible content editing, and tools that fit the way a
                business already works. The goal is a digital presence that feels polished on the
                outside and useful behind the scenes.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 border-t border-[#1C2830]/20 px-4 pt-12 sm:px-6 md:gap-12 md:pt-16 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-5">
            <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
              Why self-hosted matters
            </h2>
          </Reveal>
          <div className="space-y-6 md:space-y-8 lg:col-span-7">
            <Reveal delay={100}>
              <p className="text-lg leading-8 text-[#1C2830]/80 md:text-xl md:leading-9">
                We believe in self-hosted solutions that give you complete control over your digital
                presence. That means your website, content, and business systems can be shaped
                around how you operate rather than being boxed into a one-size-fits-all platform.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg leading-8 text-[#1C2830]/75">
                For clients looking for a website developer in Nelson NZ, this approach means
                cleaner ownership, better flexibility, and room to build custom workflows, booking
                systems, ecommerce, dashboards, and content management around the business.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 border-t border-[#1C2830]/20 px-4 pt-12 sm:px-6 md:gap-12 md:pt-16 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-4">
            <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
              The team
            </h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#1C2830]/75 md:mt-6 md:text-lg md:leading-8">
              Sidewalk is intentionally small, so the people planning the work are the same people
              responsible for delivering it.
            </p>
          </Reveal>
          <div className="lg:col-span-8">
            {team.map((member, index) => (
              <Reveal
                key={member.name}
                delay={100 + index * 100}
                className="border-t border-[#1C2830]/20 py-7 first:border-t-0 first:pt-0 md:py-8"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  <div className="md:pr-6">
                    <h3 className="text-2xl font-extrabold leading-tight text-[#B74831]">{member.name}</h3>
                    <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[#1C2830]/55">
                      {member.role}
                    </p>
                  </div>
                  <p className="md:col-span-2 text-lg leading-8 text-[#1C2830]/80">
                    {member.description}
                  </p>
                </div>
              </Reveal>
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
