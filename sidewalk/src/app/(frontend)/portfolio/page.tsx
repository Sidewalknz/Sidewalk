import { getPublishedPortfolioItems } from '@/actions/portfolio'
import { PageCTA } from '@/components/frontend/PageCTA'
import { PortfolioCard } from '@/components/frontend/PortfolioCard'
import { SidewalkHero } from '@/components/frontend/Hero'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Web Design Projects Nelson',
  description: 'Explore Sidewalk web design and web development projects from a Nelson NZ web agency building practical websites and digital systems.',
}

export default async function PortfolioPage() {
  const portfolioItems = await getPublishedPortfolioItems()

  const featured = portfolioItems.filter((p: any) => p?.featured)
  const rest = portfolioItems.filter((p: any) => !p?.featured)

  return (
    <div>
      <SidewalkHero
        title="projects"
        description="A selection of Nelson web design, website design, web development, and digital system projects built for practical long-term control."
        highlights={['Nelson web design', 'website design', 'web development', 'digital system projects']}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-24">
        {featured.length ? (
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                Featured
              </h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p: any) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
              All portfolio
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow" />
          </div>

          {rest.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((p: any) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase italic">
                Portfolio items are coming soon
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                Add portfolio items through the admin panel to see them here.
              </p>
            </div>
          )}
        </section>
      </div>

      <PageCTA
        title="Planning something similar?"
        description="Start with the services page to see the website packages and custom web solutions we can shape around your project."
        href="/services"
        linkLabel="View services"
      />
    </div>
  )
}

