import Link from 'next/link'

export function PortfolioCard({ project }: { project: any }) {
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

  return (
    <Link
      href={href}
      className="group relative grid h-[30rem] grid-cols-1 overflow-visible bg-[#1C2830] text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-600/10 md:h-[20rem] md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]"
    >
      {backgroundMedia?.url ? (
        <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {backgroundIsVideo ? (
            <video
              src={backgroundMedia.url}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={backgroundMedia.url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-center p-8 lg:p-10">
        <h3 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
          {project?.title || 'Untitled'}
        </h3>

        <p
          className={`mt-4 min-h-[7rem] max-w-xl overflow-hidden text-base font-medium leading-7 text-white/75 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] ${
            project?.shortDescription ? '' : 'invisible'
          }`}
          aria-hidden={!project?.shortDescription}
        >
          {project?.shortDescription || 'Portfolio project summary'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/55">
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

      <div className="relative z-10 h-full overflow-visible opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-6">
        {foregroundMedia?.url ? (
          foregroundIsVideo ? (
            <video
              src={foregroundMedia.url}
              className="absolute bottom-0 right-0 h-[125%] w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03] md:-top-8 md:bottom-auto md:h-[calc(100%+3rem)]"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={foregroundMedia.url}
              alt={project?.foregroundMediaAlt || project?.title || ''}
              className="absolute bottom-0 right-0 h-[125%] w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03] md:-top-8 md:bottom-auto md:h-[calc(100%+3rem)]"
            />
          )
        ) : null}
      </div>
    </Link>
  )
}

