import React from 'react'
import { getPublishedPortfolioClientNames } from '@/actions/portfolio'

export async function ClientMarquee() {
  const clientNames = await getPublishedPortfolioClientNames()

  if (!clientNames.length) return null

  const marqueeItems = [...clientNames, ...clientNames]

  return (
    <section className="client-marquee border-y border-[#1C2830]/20 bg-[#F3ECE3] py-6" aria-label="Clients we have helped">
      <div className="client-marquee__track">
        {marqueeItems.map((name, index) => (
          <span key={`${name}-${index}`} className="client-marquee__item">
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
