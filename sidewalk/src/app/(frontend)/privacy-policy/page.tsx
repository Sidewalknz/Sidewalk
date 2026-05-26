import React from 'react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Sidewalk, a Nelson NZ web agency providing web design, website design, and web development services.',
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information we collect',
      content: 'We collect personal information you choose to send us through this website or by email, such as your name, email address, phone number, business name, project details, and any files or notes you include with an enquiry. We may also collect basic technical information such as your IP address, browser, device, pages visited, and referral source through website analytics, logs, cookies, or similar tools.',
    },
    {
      title: 'Why we collect it',
      content: 'We collect this information to respond to enquiries, discuss potential projects, provide quotes, deliver website and digital services, maintain business records, improve this website, monitor security, and meet legal or accounting obligations. We only collect information where it is connected to these purposes.',
    },
    {
      title: 'How we store and protect it',
      content: 'We take reasonable steps to keep personal information secure and protect it from loss, unauthorised access, misuse, disclosure, alteration, or destruction. Information may be stored in email, project management tools, website hosting systems, analytics tools, or other service providers used to run Sidewalk and deliver client work.',
    },
    {
      title: 'Sharing and service providers',
      content: 'We do not sell personal information. We may share information with trusted service providers where needed to operate this website, manage enquiries, host websites, send email, analyse website performance, process payments, or deliver project work. Some providers may store or process information outside New Zealand. Where that happens, we take reasonable steps to use providers with appropriate privacy and security protections.',
    },
    {
      title: 'Cookies and analytics',
      content: 'This website may use cookies, analytics, server logs, and similar technologies to understand how visitors use the site and to keep it secure. You can usually disable or limit cookies through your browser settings, although some website functions may not work as expected.',
    },
    {
      title: 'Access, correction, and privacy breaches',
      content: 'Under the New Zealand Privacy Act 2020, you can ask to access or correct personal information we hold about you. If we become aware of a privacy breach that has caused serious harm or is likely to do so, we will notify the Office of the Privacy Commissioner and affected people where required by law.',
    },
  ]

  return (
    <div>
      <SidewalkHero
        title="Privacy policy"
        description="How Sidewalk handles website enquiries, contact details, project information, and personal information shared with our Nelson web agency."
        highlights={['privacy', 'website enquiries', 'contact details', 'Nelson web agency']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Last modified</p>
            <p className="mt-1 text-2xl font-extrabold">May 26, 2026</p>
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
                This page explains what personal information this website may collect, how Sidewalk uses it, and your rights under New Zealand privacy law.
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
