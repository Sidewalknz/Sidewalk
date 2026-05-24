import React from 'react'
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { SidewalkHero } from '@/components/frontend/Hero'

export const metadata = {
  title: 'Contact a Web Designer Nelson NZ',
  description: 'Contact Sidewalk, a web designer and website developer in Nelson NZ for web design, website design, and web development projects.',
}

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="text-brand-600" size={20} />,
      label: 'Email Us',
      value: 'admin@sidewalk.co.nz',
    },
    {
      icon: <Phone className="text-brand-600" size={20} />,
      label: 'Call Us',
      value: '+1 (555) 000-0000',
    },
    {
      icon: <MapPin className="text-brand-600" size={20} />,
      label: 'Visit Us',
      value: 'Nelson, New Zealand',
    },
  ]

  return (
    <div className="pb-24">
      <SidewalkHero
        title="contact"
        description="Looking for a web designer in Nelson NZ, a website developer, or a web agency for your next project? Tell us what you are building."
        highlights={['web designer in Nelson NZ', 'website developer', 'web agency']}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column: Form */}
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                Let's <span className="text-brand-600">Connect</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Have a question about web design, website design, or web development in Nelson? Drop us a message and we will get back to you shortly.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Right Column: Info */}
          <div className="order-1 lg:order-2">
            <div className="bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-12 lg:p-16 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] -mr-32 -mb-32" />
              
              <div>
                <div className="bg-brand-600/10 text-brand-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-8">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                  We're here to help you build something extraordinary. 
                  Reach out through any of these channels.
                </p>

                <div className="space-y-10">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-start space-x-6">
                      <div className="bg-slate-800 p-4 rounded-2xl text-white">
                        {info.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{info.label}</div>
                        <div className="text-xl font-medium text-white">{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-20">
                <div className="inline-flex items-center space-x-2 text-slate-500 font-medium">
                  <span>Operating in</span>
                  <span className="text-white">Auckland GMT+12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
