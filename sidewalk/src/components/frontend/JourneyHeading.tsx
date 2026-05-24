'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function JourneyHeading({
  top,
  bottom,
  reveal,
}: {
  top: string
  bottom: string
  reveal: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const updateOpenState = useCallback(() => {
    const reveal = revealRef.current
    if (!reveal) return

    const rect = reveal.getBoundingClientRect()
    const revealCenter = rect.top + rect.height / 2
    const viewportMiddle = window.innerHeight / 2

    if (revealCenter <= viewportMiddle) {
      setIsOpen(true)
    }
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) setHasEntered(true)
      },
      { threshold: [0, 0.15], rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    updateOpenState()

    window.addEventListener('scroll', updateOpenState, { passive: true })
    window.addEventListener('resize', updateOpenState)

    return () => {
      window.removeEventListener('scroll', updateOpenState)
      window.removeEventListener('resize', updateOpenState)
    }
  }, [updateOpenState])

  return (
    <div
      ref={ref}
      className={cn('home-journey-heading', hasEntered && 'has-entered', isOpen && 'is-open')}
      aria-hidden="true"
    >
      <div className="home-journey-heading__line home-journey-heading__line--top">{top}</div>
      <div ref={revealRef} className="home-journey-heading__middle">{reveal}</div>
      <div className="home-journey-heading__line home-journey-heading__line--bottom">{bottom}</div>
    </div>
  )
}
