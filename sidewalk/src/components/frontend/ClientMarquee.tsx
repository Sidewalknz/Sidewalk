import React from 'react'
import Link from 'next/link'
import { getPublishedPortfolioClientsForMarquee } from '@/actions/portfolio'

export async function ClientMarquee() {
  const clients = await getPublishedPortfolioClientsForMarquee()

  if (!clients.length) return null

  const marqueeItems = [...clients, ...clients]

  return (
    <section className="client-marquee border-y border-[#F3ECE3]/15 bg-[#1C2830] py-6" aria-label="Clients we have helped">
      <div className="client-marquee__track">
        {marqueeItems.map((client, index) => (
          <Link key={`${client.name}-${index}`} href={client.href} className="client-marquee__item">
            {client.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
