import React from 'react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SidewalkHeroProps = {
  title: string
  description: string
  highlights?: string[]
  exploreHref?: string
  eyebrow?: string
  className?: string
  titleAs?: 'h1' | 'p'
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getTaglineParts = (description: string, highlights: string[]) => {
  const highlightRanges = highlights.flatMap((highlight) => {
    const matches = [...description.matchAll(new RegExp(escapeRegExp(highlight), 'gi'))]

    return matches.map((match) => ({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    }))
  })

  const parts = description.split(/(\s+)/)
  let characterIndex = 0
  let wordIndex = 0

  return parts.map((part) => {
    const start = characterIndex
    const end = start + part.length
    characterIndex = end

    if (/^\s+$/.test(part)) {
      return {
        text: part,
        isSpace: true,
        highlighted: false,
        wordIndex: -1,
      }
    }

    const currentWordIndex = wordIndex
    wordIndex += 1

    return {
      text: part,
      isSpace: false,
      highlighted: highlightRanges.some((range) => start < range.end && end > range.start),
      wordIndex: currentWordIndex,
    }
  })
}

export const SidewalkHero = ({
  title,
  description,
  highlights = [],
  exploreHref,
  eyebrow,
  className,
  titleAs = 'h1',
}: SidewalkHeroProps) => {
  const TitleTag = titleAs
  const taglineParts = getTaglineParts(description, highlights)

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
            {taglineParts.map((part, index) => part.isSpace ? (
              <React.Fragment key={`space-${index}`}>{part.text}</React.Fragment>
            ) : (
              <span
                key={`${part.text}-${index}`}
                className={cn(
                  'sidewalk-hero__tagline-word',
                  part.highlighted && 'sidewalk-hero__tagline-word--highlight',
                )}
                style={{ animationDelay: `${520 + part.wordIndex * 45}ms` }}
              >
                {part.text}
              </span>
            ))}
          </p>

          {exploreHref ? (
            <Link href={exploreHref} className="sidewalk-hero__explore" aria-label="Explore homepage content">
              <span>Explore</span>
              <ArrowDown className="h-6 w-6" aria-hidden="true" />
            </Link>
          ) : null}
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
      className="sidewalk-hero--home"
      exploreHref="#home-content"
      highlights={[
        'web solutions',
        'web design',
        'website design',
        'web development',
        'Nelson',
        'clear strategy',
        'flexible content management',
        'digital systems',
      ]}
    />
  )
}
