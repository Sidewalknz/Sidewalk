import Link from 'next/link'

type PageCTAProps = {
  title: string
  description: string
  href: string
  linkLabel: string
  className?: string
}

export const PageCTA = ({
  title,
  description,
  href,
  linkLabel,
  className = '',
}: PageCTAProps) => {
  return (
    <section className={`relative overflow-visible bg-[#B74831] pt-20 pb-28 text-white ${className}`}>
      <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-8">
          <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
            {title}
          </h2>
          <p className="text-xl leading-9 text-white/85">
            {description}
          </p>
          <Link
            href={href}
            className="inline-flex text-lg font-extrabold text-white underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white"
          >
            {linkLabel}
          </Link>
        </div>
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
