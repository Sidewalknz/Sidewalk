import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { getPortfolioItemBySlug, getPublishedPortfolioItems } from '@/actions/portfolio'
import { PortfolioCard } from '@/components/frontend/PortfolioCard'
import { SidewalkHero } from '@/components/frontend/Hero'

export const dynamic = 'force-dynamic'

function toArray<T>(raw: any): T[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as T[]
  return []
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPortfolioItemBySlug(slug)
  if (!project) return notFound()

  const backgroundMedia =
    project?.backgroundMedia && typeof project.backgroundMedia === 'object'
      ? project.backgroundMedia
      : project?.featuredImage && typeof project.featuredImage === 'object'
        ? project.featuredImage
        : null
  const foregroundMedia = project?.foregroundMedia && typeof project.foregroundMedia === 'object' ? project.foregroundMedia : null
  const backgroundIsVideo = backgroundMedia?.mimeType?.startsWith?.('video/')
  const foregroundIsVideo = foregroundMedia?.mimeType?.startsWith?.('video/')
  const gallery = toArray<any>(project?.gallery)
  const services = toArray<any>(project?.services)
    .map((s) => (typeof s === 'string' ? s : s?.service))
    .map((s) => String(s || '').trim())
    .filter(Boolean)
  const testimonial = project?.testimonial && typeof project.testimonial === 'object' ? project.testimonial : null

  const hasStory = Boolean(project?.overview || project?.challenge || project?.solution || project?.outcome)
  const hasAside = Boolean(services.length || testimonial?.message)
  const projectType = String(project?.projectType || 'project').trim()

  const allPublished = await getPublishedPortfolioItems()
  const currentIndex = (allPublished || []).findIndex((p: any) => p?.id === project?.id)
  const nextPortfolio =
    allPublished.length > 1
      ? allPublished[(currentIndex >= 0 ? currentIndex + 1 : 0) % allPublished.length]
      : null

  return (
    <div className="bg-[#F3ECE3]">
      <SidewalkHero
        title={project?.title || 'project'}
        description=""
        highlights={[projectType, project?.title].filter(Boolean) as string[]}
        brandText={projectType}
        className="sidewalk-hero--portfolio-detail"
      />

      <section className="mt-8 bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {project?.location ? (
            <div className="border-l border-white/20 pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">Location</p>
              <p className="mt-1 text-2xl font-extrabold">{project.location}</p>
            </div>
          ) : null}
          {project?.projectType ? (
            <div className="border-l border-white/20 pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">Project type</p>
              <p className="mt-1 text-2xl font-extrabold">{project.projectType}</p>
            </div>
          ) : null}
          {project?.websiteUrl ? (
            <div className="border-l border-white/20 pl-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">Website</p>
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-2xl font-extrabold transition-colors hover:text-[#B74831]"
              >
                Visit website
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          aria-label="Back to portfolio"
          className="group inline-flex w-fit items-center gap-3 text-sm font-black uppercase tracking-widest text-[#1C2830]/55 transition-colors hover:text-[#B74831]"
        >
          <span
            aria-hidden="true"
            className="h-5 w-7 rotate-180 bg-current transition-transform group-hover:-translate-x-1"
            style={{
              WebkitMask: 'url(/icons/right-arrow.svg) center / contain no-repeat',
              mask: 'url(/icons/right-arrow.svg) center / contain no-repeat',
            }}
          />
          Back to portfolio
        </Link>

        {backgroundMedia?.url || foregroundMedia?.url ? (
          <div className="relative overflow-visible bg-[#1C2830]">
            <div className="relative aspect-[16/8] overflow-hidden">
              {backgroundMedia?.url ? (
                backgroundIsVideo ? (
                  <video
                    src={backgroundMedia.url}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={backgroundMedia.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )
              ) : null}
              {foregroundMedia?.url ? (
                foregroundIsVideo ? (
                  <video
                    src={foregroundMedia.url}
                    className="absolute inset-0 h-full w-full object-contain object-center"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={foregroundMedia.url}
                    alt={project?.foregroundMediaAlt || project?.title || ''}
                    className="absolute inset-0 h-full w-full object-contain object-center"
                  />
                )
              ) : null}
            </div>
          </div>
        ) : null}

        {hasStory || hasAside ? (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            {hasStory ? (
              <div className="space-y-16">
                {project?.overview ? (
                  <div className="space-y-6 border-t border-[#1C2830]/20 pt-12">
                    <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">Overview</h2>
                    <p className="text-xl leading-9 text-[#1C2830]/80 whitespace-pre-line">
                      {project.overview}
                    </p>
                  </div>
                ) : null}
                {project?.challenge ? (
                  <div className="space-y-6 border-t border-[#1C2830]/20 pt-12">
                    <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">Challenge</h2>
                    <p className="text-lg leading-8 text-[#1C2830]/75 whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                ) : null}
                {project?.solution ? (
                  <div className="space-y-6 border-t border-[#1C2830]/20 pt-12">
                    <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">Solution</h2>
                    <p className="text-lg leading-8 text-[#1C2830]/75 whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                ) : null}
                {project?.outcome ? (
                  <div className="space-y-6 border-t border-[#1C2830]/20 pt-12">
                    <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">Outcome</h2>
                    <p className="text-lg leading-8 text-[#1C2830]/75 whitespace-pre-line">
                      {project.outcome}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {hasAside ? (
              <aside className="space-y-8">
                {services.length ? (
                  <div className="bg-[#1C2830] p-8 space-y-4 text-white">
                    <div className="text-sm font-bold uppercase tracking-widest text-white/50">Services</div>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="border border-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {testimonial?.message ? (
                  <div className="space-y-4 p-8">
                    <div className="text-sm font-bold uppercase tracking-widest text-[#1C2830]/55">
                      Testimonial
                    </div>
                    <p className="text-lg leading-8 text-[#1C2830]/80 whitespace-pre-line">
                      "{testimonial.message}"
                    </p>
                    {testimonial?.name ? (
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#1C2830]/55">
                        - {testimonial.name}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </aside>
            ) : null}
          </section>
        ) : null}

        {gallery.length ? (
          <section className="space-y-8">
            <div className="border-t border-[#1C2830]/20 pt-16">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] md:text-6xl">Gallery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((g: any, idx: number) => {
                const image = g?.image && typeof g.image === 'object' ? g.image : null
                return image?.url ? (
                  <div
                    key={`${image?.id || idx}`}
                    className="overflow-hidden bg-[#1C2830] aspect-[4/3]"
                  >
                    <img src={image.url} alt={g?.alt || ''} className="w-full h-full object-cover" />
                  </div>
                ) : null
              })}
            </div>
          </section>
        ) : null}

      </div>

      {nextPortfolio ? (
        <section className="relative mt-24 overflow-visible bg-[#B74831] pt-24 pb-44">
          <div className="relative z-30 mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Check out another project
            </h2>
            <PortfolioCard project={nextPortfolio} />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-[38%] overflow-hidden px-4 text-center text-[clamp(5rem,18vw,16rem)] font-extrabold leading-none text-[#1C2830] sm:px-6 lg:px-8"
          >
            sidewalk
          </div>
        </section>
      ) : null}
    </div>
  )
}
