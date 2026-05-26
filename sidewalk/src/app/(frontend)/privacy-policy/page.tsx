import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Sidewalk, a Nelson NZ web agency providing web design, website design, and web development services.',
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, and payment information.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about updates and offers.',
    },
    {
      title: 'Data Security',
      content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.',
    },
    {
      title: 'Cookies and Tracking',
      content: "We use cookies and similar tracking technologies to analyze trends, administer the website, and track users' movements around the website.",
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="privacy policy"
        description="How Sidewalk handles privacy, website enquiries, contact details, and information shared through our Nelson web agency services."
        highlights={['privacy', 'website enquiries', 'contact details', 'Nelson web agency']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Last modified</p>
            <p className="mt-1 text-2xl font-extrabold">March 5, 2026</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Questions</p>
            <p className="mt-1 text-2xl font-extrabold">Contact Sidewalk</p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">
                Privacy
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#1C2830]/75">
                This page explains the information we may collect, how it is used, and how to contact us about privacy questions.
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
                If you have any questions about this Privacy Policy, please{' '}
                <a href="/contact" className="font-extrabold text-[#B74831] hover:underline">
                  contact us
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
