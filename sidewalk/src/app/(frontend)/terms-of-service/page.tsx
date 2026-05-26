import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Sidewalk, a Nelson web agency offering web design, website design, and web development services.',
}

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Using this website',
      content: 'By using this website, you agree to use it for lawful purposes and in a way that does not interfere with the website, its security, or other people using it. Website content is provided for general information about Sidewalk and our services and is not a binding quote or formal project agreement.',
    },
    {
      title: 'Enquiries and project work',
      content: 'Submitting an enquiry does not create a client relationship or require either party to proceed with a project. Any project scope, deliverables, timing, fees, payment terms, hosting, maintenance, ownership, and support arrangements will be confirmed separately in writing before work begins.',
    },
    {
      title: 'Content and intellectual property',
      content: 'Unless stated otherwise, the text, design, layout, graphics, code, and other material on this website belong to Sidewalk or are used with permission. You may view and share this website for ordinary personal or business reference, but you must not copy, reproduce, adapt, or reuse substantial parts of it without written permission.',
    },
    {
      title: 'Third-party links and tools',
      content: 'This website may link to third-party websites, tools, or services. Those third parties are responsible for their own content, terms, privacy practices, availability, and security. We are not responsible for loss or damage caused by third-party websites or services.',
    },
    {
      title: 'Liability and New Zealand consumer law',
      content: 'Nothing in these terms limits any rights you may have under New Zealand law, including the Consumer Guarantees Act 1993 and Fair Trading Act 1986 where they apply. To the extent permitted by law, Sidewalk is not liable for indirect, consequential, or special loss arising from use of this website or reliance on its general content.',
    },
    {
      title: 'Governing law',
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
            <p className="mt-1 text-2xl font-extrabold">May 26, 2026</p>
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
                These terms cover use of this website. Project-specific terms are agreed separately before client work begins.
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
