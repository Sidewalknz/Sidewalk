import React from 'react'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-[#1C2830] pt-16 pb-6 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-12">
          <div className="md:col-span-6 space-y-6">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <img src="/logo1.svg" alt="Sidewalk" className="h-10 w-auto" />
            </Link>
            <p className="text-stone-300 max-w-sm leading-relaxed">
              A Nelson web agency creating web design, website design, web development, and practical web solutions for businesses across Nelson NZ.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><Link href="/privacy-policy" className="text-stone-300 hover:text-brand-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-stone-300 hover:text-brand-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider mb-4">
              Socials
            </h3>
            <p className="text-stone-300 leading-relaxed mb-4">
              Follow Sidewalk for Nelson web design updates, recent builds, and practical website advice from a local web agency.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61581022527859"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sidewalk on Facebook"
                className="inline-flex h-8 w-8 items-center justify-center text-stone-300 hover:text-brand-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.699 4.533-4.699 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/sidewalk.co.nz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sidewalk on Instagram"
                className="inline-flex h-8 w-8 items-center justify-center text-stone-300 hover:text-brand-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92C2.174 15.584 2.163 15.205 2.163 12c0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.418 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838Zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-t border-stone-100/15 pt-8">
          <p className="select-none text-center text-[clamp(4rem,17vw,15rem)] font-black lowercase leading-none tracking-normal text-stone-100">
            sidewalk
          </p>
        </div>
      </div>
    </footer>
  )
}
