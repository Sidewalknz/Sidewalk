'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Service = {
  title: string
  text: string
}

export function ServiceStickyMenu({
  services,
  reverse = false,
}: {
  services: Service[]
  reverse?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const ignoreScrollUntilRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const [isPanelVisible, setIsPanelVisible] = useState(true)
  const activeService = services[displayedIndex] ?? services[0]
  const maxIndex = Math.max(services.length - 1, 0)

  const getScrollTopForIndex = useCallback((index: number) => {
    const element = ref.current
    if (!element || services.length === 0) return null

    const section = element.closest('section')
    if (!section) return null

    const rect = section.getBoundingClientRect()
    const sectionTop = window.scrollY + rect.top
    const scrollDistance = Math.max(rect.height - window.innerHeight, 1)
    const targetProgress = Math.min(Math.max((index + 0.5) / services.length, 0), 1)
    const sectionProgress = 0.12 + targetProgress * 0.76

    return sectionTop + scrollDistance * sectionProgress
  }, [services.length])

  const scrollToService = useCallback((index: number) => {
    ignoreScrollUntilRef.current = Date.now() + 900
    setActiveIndex(index)

    const targetTop = getScrollTopForIndex(index)
    if (targetTop === null) return

    window.scrollTo({
      top: targetTop,
      behavior: 'auto',
    })
  }, [getScrollTopForIndex])

  useEffect(() => {
    if (activeIndex === displayedIndex) return

    setIsPanelVisible(false)

    const fadeTimer = window.setTimeout(() => {
      setDisplayedIndex(activeIndex)
      window.requestAnimationFrame(() => setIsPanelVisible(true))
    }, 180)

    return () => window.clearTimeout(fadeTimer)
  }, [activeIndex, displayedIndex])

  const updateActiveService = useCallback(() => {
    if (Date.now() < ignoreScrollUntilRef.current) return

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
    <div ref={ref} className={cn('home-service-menu', reverse && 'home-service-menu--reverse')}>
      <div className="home-service-menu__nav" aria-label="Service categories">
        {services.map((service, index) => (
          <button
            key={service.title}
            type="button"
            className={cn('home-service-menu__button', index === activeIndex && 'is-active')}
            aria-pressed={index === activeIndex}
            onClick={() => scrollToService(index)}
            onFocus={() => setActiveIndex(index)}
          >
            {service.title}
          </button>
        ))}
      </div>

      <div
        className={cn('home-service-menu__panel', isPanelVisible && 'is-visible')}
        aria-live="polite"
      >
        <h3 className="home-service-menu__title">{activeService.title}</h3>
        <p className="home-service-menu__text">{activeService.text}</p>
      </div>
    </div>
  )
}
