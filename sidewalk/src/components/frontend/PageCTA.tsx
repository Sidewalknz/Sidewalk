import Link from 'next/link'
import { Reveal } from '@/components/frontend/Reveal'

type PageCTAProps = {
  title: string
  description: string
  href: string
  linkLabel: string
  className?: string
}

export const PageCTA = ({ title, description, href, linkLabel, className = '' }: PageCTAProps) => {
  return (
    <section
      className={`relative overflow-visible bg-[#B74831] pt-20 pb-44 text-white ${className}`}
    >
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-4xl space-y-8">
          <div>
            <Link
              href={href}
              aria-label={linkLabel}
              className="group flex w-fit items-center gap-5 text-white sm:gap-8"
            >
              <h2 className="whitespace-nowrap text-[clamp(2rem,7vw,3.75rem)] font-extrabold leading-tight">
                {title}
              </h2>
              <span
                aria-hidden="true"
                className="h-10 w-14 shrink-0 bg-current transition-transform duration-300 group-hover:translate-x-2 md:h-14 md:w-[4.9rem]"
                style={{
                  WebkitMask: 'url(/icons/right-arrow.svg) center / contain no-repeat',
                  mask: 'url(/icons/right-arrow.svg) center / contain no-repeat',
                }}
              />
            </Link>
            <p className="mt-8 text-xl leading-9 text-white/85">{description}</p>
          </div>
        </Reveal>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-[38%] overflow-hidden px-4 text-center text-[clamp(5rem,18vw,16rem)] font-extrabold leading-none text-[#1C2830] sm:px-6 lg:px-8"
      >
        sidewalk
      </div>
    </section>
  )
}
