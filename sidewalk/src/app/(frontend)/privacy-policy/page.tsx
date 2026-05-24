import React from 'react'
import { Shield, Lock, Eye, FileText } from 'lucide-react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Sidewalk, a Nelson NZ web agency providing web design, website design, and web development services.',
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <Eye className="text-brand-600" size={24} />,
      content: 'We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, and payment information.'
    },
    {
      title: 'How We Use Your Information',
      icon: <Lock className="text-brand-600" size={24} />,
      content: 'We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about updates and offers.'
    },
    {
      title: 'Data Security',
      icon: <Shield className="text-brand-600" size={24} />,
      content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.'
    },
    {
      title: 'Cookies and Tracking',
      icon: <FileText className="text-brand-600" size={24} />,
      content: 'We use cookies and similar tracking technologies to analyze trends, administer the website, and track users’ movements around the website.'
    }
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="privacy policy"
        description="How Sidewalk handles privacy, website enquiries, contact details, and information shared through our Nelson web agency services."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Last modified: March 5, 2026
          </p>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            If you have any questions about this Privacy Policy, please <a href="/contact" className="text-brand-600 hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
