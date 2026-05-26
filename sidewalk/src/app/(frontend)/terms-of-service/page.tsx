import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Sidewalk, a Nelson web agency offering web design, website design, and web development services.',
}

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
    },
    {
      title: 'User Responsibilities',
      content: "You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.",
    },
    {
      title: 'Limitations of Liability',
      content: 'We shall not be liable for any direct, indirect, incidental, special or consequential damages that result from the use of, or the inability to use, our services.',
    },
    {
      title: 'Governing Law',
      content: 'This agreement shall be governed by and construed in accordance with the laws of New Zealand, without regard to its conflict of law provisions.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="terms of service"
        description="The terms that apply when using Sidewalk services, website content, project communication, and digital work provided by our Nelson web agency."
        highlights={['Sidewalk services', 'website content', 'project communication', 'Nelson web agency']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Last modified</p>
            <p className="mt-1 text-2xl font-extrabold">March 5, 2026</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Applies to</p>
            <p className="mt-1 text-2xl font-extrabold">Website and services</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                Terms
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#1C2830]/75">
                These terms outline how this website and Sidewalk services should be used.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#1C2830]/20 lg:col-span-8">
            {sections.map((section) => (
              <div key={section.title} className="py-8 first:pt-0">
                <h2 className="text-3xl font-extrabold leading-tight text-[#B74831]">
                  {section.title}
                </h2>
                <p className="mt-4 text-lg leading-8 text-[#1C2830]/80">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="border-t border-[#1C2830]/20 pt-8">
              <p className="text-lg leading-8 text-[#1C2830]/75">
                By using our services, you agree to these terms. If you do not agree, please do not use our services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
