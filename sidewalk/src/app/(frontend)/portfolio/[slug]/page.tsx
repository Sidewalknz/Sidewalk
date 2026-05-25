import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MapPin, Quote, Tag } from 'lucide-react'
import { getPortfolioItemBySlug, getPublishedPortfolioItems } from '@/actions/portfolio'
import { PortfolioCard } from '@/components/frontend/PortfolioCard'

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

  const hasMeta = Boolean(project?.location || project?.projectType || project?.websiteUrl)
  const hasStory = Boolean(project?.overview || project?.challenge || project?.solution || project?.outcome)
  const hasAside = Boolean(services.length || testimonial?.message)

  const allPublished = await getPublishedPortfolioItems()
  const related = (allPublished || [])
    .filter((p: any) => p?.id && p.id !== project?.id)
    .map((p: any) => {
      const pServices = toArray<any>(p?.services)
        .map((s) => (typeof s === 'string' ? s : s?.service))
        .map((s) => String(s || '').trim())
        .filter(Boolean)
      const sharedServices = pServices.filter((s) => services.includes(s)).length
      const typeMatch = project?.projectType && p?.projectType && p.projectType === project.projectType
      return { p, score: (typeMatch ? 3 : 0) + sharedServices }
    })
    .filter((x: any) => x.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 6)
    .map((x: any) => x.p)

  return (
    <div className="pt-28 pb-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <header className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
            {project?.title}
          </h1>

          {hasMeta ? (
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {project?.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-300" />
                  {project.location}
                </span>
              ) : null}
              {project?.projectType ? (
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-300" />
                  {project.projectType}
                </span>
              ) : null}
              {project?.websiteUrl ? (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-500 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit website
                </a>
              ) : null}
            </div>
          ) : null}
        </header>

        {backgroundMedia?.url || foregroundMedia?.url ? (
          <div className="relative overflow-visible bg-[#1C2830]">
            <div className="relative aspect-[16/8] overflow-hidden">
              {backgroundMedia?.url ? (
                backgroundIsVideo ? (
                  <video
                    src={backgroundMedia.url}
                    className="h-full w-full object-cover opacity-70"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={backgroundMedia.url}
                    alt=""
                    className="h-full w-full object-cover opacity-70"
                  />
                )
              ) : null}
              <div className="absolute inset-0 bg-[#1C2830]/35" />
              {foregroundMedia?.url ? (
                foregroundIsVideo ? (
                  <video
                    src={foregroundMedia.url}
                    className="absolute bottom-0 right-0 h-[115%] w-full object-contain object-bottom"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={foregroundMedia.url}
                    alt={project?.foregroundMediaAlt || project?.title || ''}
                    className="absolute bottom-0 right-0 h-[115%] w-full object-contain object-bottom"
                  />
                )
              ) : null}
            </div>
          </div>
        ) : null}

        {hasStory || hasAside ? (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
            {hasStory ? (
              <div className="space-y-10">
                {project?.overview ? (
                  <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Overview</h2>
                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                      {project.overview}
                    </p>
                  </div>
                ) : null}
                {project?.challenge ? (
                  <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Challenge</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                ) : null}
                {project?.solution ? (
                  <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Solution</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                ) : null}
                {project?.outcome ? (
                  <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Outcome</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                      {project.outcome}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {hasAside ? (
              <aside className="space-y-8">
                {services.length ? (
                  <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Services</div>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {testimonial?.message ? (
                  <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4 shadow-xl shadow-slate-200/30 dark:shadow-none">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <Quote className="w-4 h-4 text-brand-600" /> Testimonial
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                      "{testimonial.message}"
                    </p>
                    {testimonial?.name ? (
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
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
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">Gallery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((g: any, idx: number) => {
                const image = g?.image && typeof g.image === 'object' ? g.image : null
                return image?.url ? (
                  <div
                    key={`${image?.id || idx}`}
                    className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[4/3]"
                  >
                    <img src={image.url} alt={g?.alt || ''} className="w-full h-full object-cover" />
                  </div>
                ) : null
              })}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="space-y-10 pt-10">
            <div className="border-t border-[#1C2830]/20 pt-16">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">Related portfolio</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p: any) => (
                <PortfolioCard key={p.id || p} project={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
