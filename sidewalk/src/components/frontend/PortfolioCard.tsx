'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function PortfolioCard({ project }: { project: any }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [isInView, setIsInView] = useState(false)
  const backgroundMedia =
    project?.backgroundMedia && typeof project.backgroundMedia === 'object'
      ? project.backgroundMedia
      : project?.featuredImage && typeof project.featuredImage === 'object'
        ? project.featuredImage
        : null
  const foregroundMedia = project?.foregroundMedia && typeof project.foregroundMedia === 'object' ? project.foregroundMedia : null
  const href = `/portfolio/${project?.slug || ''}`
  const backgroundIsVideo = backgroundMedia?.mimeType?.startsWith?.('video/')
  const foregroundIsVideo = foregroundMedia?.mimeType?.startsWith?.('video/')
  const usesDarkText = project?.cardTextTone === 'dark'

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.2)
      },
      { threshold: [0, 0.2] },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      ref={cardRef}
      href={href}
      className={cn(
        'group relative grid min-h-[22rem] grid-cols-1 overflow-visible bg-[#1C2830] text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-600/10 md:h-[20rem] md:min-h-0 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]',
        isInView && 'shadow-2xl shadow-brand-600/10',
      )}
    >
      {backgroundMedia?.url ? (
        <div
          className={cn(
            'absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            isInView && 'opacity-100',
          )}
        >
          {backgroundIsVideo ? (
            <video
              src={backgroundMedia.url}
              className={cn(
                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]',
                isInView && 'scale-[1.03]',
              )}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={backgroundMedia.url}
              alt=""
              className={cn(
                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]',
                isInView && 'scale-[1.03]',
              )}
            />
          )}
        </div>
      ) : null}

      <div className="relative z-20 flex h-full flex-col justify-start p-6 pt-8 md:z-10 md:justify-center md:p-8 lg:p-10">
        <h3
          className={cn(
            'text-2xl font-extrabold leading-tight text-white transition-colors duration-500 md:text-4xl',
            usesDarkText && 'group-hover:text-[#1C2830]',
            usesDarkText && isInView && 'text-[#1C2830]',
          )}
        >
          {project?.title || 'Untitled'}
        </h3>

        <p
          className={cn(
            'mt-3 max-w-xl overflow-hidden text-base font-medium leading-7 text-white/75 transition-colors duration-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] md:mt-4 md:min-h-[7rem] md:[-webkit-line-clamp:4]',
            usesDarkText && 'group-hover:text-[#1C2830]/75',
            usesDarkText && isInView && 'text-[#1C2830]/75',
            !project?.shortDescription && 'invisible',
          )}
          aria-hidden={!project?.shortDescription}
        >
          {project?.shortDescription || 'Portfolio project summary'}
        </p>

        <div
          className={cn(
            'mt-4 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/55 transition-colors duration-500',
            usesDarkText && 'group-hover:text-[#1C2830]/55',
            usesDarkText && isInView && 'text-[#1C2830]/55',
          )}
        >
          {project?.location ? (
            <span>
              {project.location}
            </span>
          ) : null}
          {project?.projectType ? (
            <span>
              {project.projectType}
            </span>
          ) : null}
        </div>

      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-full overflow-visible opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:relative md:inset-auto md:translate-y-6',
          isInView && 'translate-y-0 opacity-100',
        )}
      >
        {foregroundMedia?.url ? (
          foregroundIsVideo ? (
            <video
              src={foregroundMedia.url}
              className={cn(
                'absolute -bottom-10 right-0 h-[78%] w-full object-contain object-bottom drop-shadow-[0_1.5rem_1.25rem_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.03] md:-top-8 md:bottom-auto md:h-[calc(100%+3rem)]',
                isInView && 'scale-[1.03]',
              )}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={foregroundMedia.url}
              alt={project?.foregroundMediaAlt || project?.title || ''}
              className={cn(
                'absolute -bottom-10 right-0 h-[78%] w-full object-contain object-bottom drop-shadow-[0_1.5rem_1.25rem_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.03] md:-top-8 md:bottom-auto md:h-[calc(100%+3rem)]',
                isInView && 'scale-[1.03]',
              )}
            />
          )
        ) : null}
      </div>
    </Link>
  )
}

