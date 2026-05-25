'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Service = {
  title: string
  text: string
}

export function ServiceStickyMenu({ services }: { services: Service[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = services[activeIndex] ?? services[0]
  const maxIndex = Math.max(services.length - 1, 0)

  const updateActiveService = useCallback(() => {
    const element = ref.current
    if (!element || services.length === 0) return

    const section = element.closest('section')
    if (!section) return

    const rect = section.getBoundingClientRect()
    const scrollDistance = Math.max(rect.height - window.innerHeight, 1)
    const sectionProgress = Math.min(Math.max((0 - rect.top) / scrollDistance, 0), 1)
    const progress = Math.min(Math.max((sectionProgress - 0.12) / 0.76, 0), 1)
    setActiveIndex(Math.min(Math.floor(progress * services.length), maxIndex))
  }, [maxIndex, services.length])

  useEffect(() => {
    updateActiveService()

    window.addEventListener('scroll', updateActiveService, { passive: true })
    window.addEventListener('resize', updateActiveService)

    return () => {
      window.removeEventListener('scroll', updateActiveService)
      window.removeEventListener('resize', updateActiveService)
    }
  }, [updateActiveService])

  return (
    <div ref={ref} className="home-service-menu">
      <div className="home-service-menu__nav" aria-label="Service categories">
        {services.map((service, index) => (
          <button
            key={service.title}
            type="button"
            className={cn('home-service-menu__button', index === activeIndex && 'is-active')}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            {service.title}
          </button>
        ))}
      </div>

      <div className="home-service-menu__panel" aria-live="polite">
        <h3 className="home-service-menu__title">{activeService.title}</h3>
        <p className="home-service-menu__text">{activeService.text}</p>
      </div>
    </div>
  )
}
