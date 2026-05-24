import React from 'react'
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Sidewalk, a Nelson web agency offering web design, website design, and web development services.',
}

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="text-brand-600" size={24} />,
      content: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.'
    },
    {
      title: 'User Responsibilities',
      icon: <FileText className="text-brand-600" size={24} />,
      content: 'You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else’s use and enjoyment of the website.'
    },
    {
      title: 'Limitations of Liability',
      icon: <AlertCircle className="text-brand-600" size={24} />,
      content: 'We shall not be liable for any direct, indirect, incidental, special or consequential damages that result from the use of, or the inability to use, our services.'
    },
    {
      title: 'Governing Law',
      icon: <Scale className="text-brand-600" size={24} />,
      content: 'This agreement shall be governed by and construed in accordance with the laws of New Zealand, without regard to its conflict of law provisions.'
    }
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="terms of service"
        description="The terms that apply when using Sidewalk services, website content, project communication, and digital work provided by our Nelson web agency."
        highlights={['Sidewalk services', 'website content', 'project communication', 'Nelson web agency']}
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
            By using our services, you agree to these terms. If you do not agree, please do not use our services.
          </p>
        </div>
      </div>
    </div>
  )
}
