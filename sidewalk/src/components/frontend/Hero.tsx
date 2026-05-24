import React from 'react'
import { cn } from '@/lib/utils'

type SidewalkHeroProps = {
  title: string
  description: string
  eyebrow?: string
  className?: string
  titleAs?: 'h1' | 'p'
}

export const SidewalkHero = ({
  title,
  description,
  eyebrow,
  className,
  titleAs = 'h1',
}: SidewalkHeroProps) => {
  const TitleTag = titleAs
  const descriptionWords = description.split(' ')

  return (
    <section
      className={cn(
        'sidewalk-hero relative isolate overflow-hidden bg-[#F3ECE3] px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-36 lg:pb-24',
        className,
      )}
    >
      <div className="sidewalk-hero__stage mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center text-center">
        <div className="sidewalk-hero__brand sidewalk-hero__brand--top" aria-hidden="true">
          SIDEWALK
        </div>

        <div className="sidewalk-hero__content">
          {eyebrow ? (
            <p className="mb-4 text-sm font-bold uppercase tracking-normal text-[#B74831]">
              {eyebrow}
            </p>
          ) : null}

          <TitleTag className="sidewalk-hero__title">
            {title}
          </TitleTag>
        </div>

        <div className="sidewalk-hero__bottom-container">
          <div className="sidewalk-hero__brand sidewalk-hero__brand--bottom" aria-hidden="true">
            SIDEWALK
          </div>

          <p className="sidewalk-hero__tagline">
            {descriptionWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="sidewalk-hero__tagline-word"
                style={{ animationDelay: `${520 + index * 45}ms` }}
              >
                {word}
                {index < descriptionWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

export const Hero = () => {
  return (
    <SidewalkHero
      title="web solutions"
      description="Creating web solutions, web design, website design, and web development for Nelson businesses that need clear strategy, flexible content management, and digital systems that support real workflows."
    />
  )
}
