import Link from 'next/link'
import { MapPin, Tag } from 'lucide-react'

export function PortfolioCard({ project }: { project: any }) {
  const image = project?.featuredImage && typeof project.featuredImage === 'object' ? project.featuredImage : null
  const href = `/portfolio/${project?.slug || ''}`

  return (
    <Link
      href={href}
      className="group relative bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-600/10 hover:-translate-y-2"
    >
      <div className="aspect-[16/4.5] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        {image?.url ? (
          <img
            src={image.url}
            alt={project?.featuredImageAlt || project?.title || ''}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
          {project?.title || 'Untitled'}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
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
        </div>

        {project?.shortDescription ? (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
            {project.shortDescription}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

