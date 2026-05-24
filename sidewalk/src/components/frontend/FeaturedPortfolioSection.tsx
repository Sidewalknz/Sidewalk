import { getHomepageFeaturedPortfolioItems } from '@/actions/portfolio'
import { PortfolioCard } from './PortfolioCard'

export const dynamic = 'force-dynamic'

export async function FeaturedPortfolioSection({ limit = 6 }: { limit?: number }) {
  const portfolioItems = await getHomepageFeaturedPortfolioItems(limit)
  if (!portfolioItems?.length) return null

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Featured <span className="text-brand-600">Portfolio</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            A selection of recent work and case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((p: any) => (
            <PortfolioCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

