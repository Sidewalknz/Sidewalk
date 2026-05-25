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
      className="group relative grid min-h-[14rem] grid-cols-1 overflow-visible bg-[#1C2830] text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-600/10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]"
    >
      {backgroundMedia?.url ? (
        <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {backgroundIsVideo ? (
            <video
              src={backgroundMedia.url}
              className="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={backgroundMedia.url}
              alt=""
              className="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-[#1C2830]/55" />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col justify-center p-8 md:min-h-[14rem] lg:p-10">
        <h3 className="text-3xl font-extrabold leading-tight text-white transition-colors group-hover:text-[#B74831] md:text-4xl">
          {project?.title || 'Untitled'}
        </h3>

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

        {project?.shortDescription ? (
          <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-white/78 line-clamp-3">
            {project.shortDescription}
          </p>
        ) : null}

      </div>

      <div className="relative z-10 min-h-[10rem] overflow-visible opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:min-h-[14rem] md:translate-y-6">
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

