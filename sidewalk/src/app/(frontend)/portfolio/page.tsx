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
        description="A selection of websites, ecommerce stores, and custom web projects built to be practical, manageable, and useful long after launch."
        highlights={['Nelson web design', 'website design', 'web development', 'digital system projects']}
      />

      <section className="bg-[#1C2830] py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Project type</p>
            <p className="mt-1 text-2xl font-extrabold">Websites and web systems</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Built for</p>
            <p className="mt-1 text-2xl font-extrabold">Real business workflows</p>
          </div>
          <div className="border-l border-white/20 pl-6">
            <p className="text-sm font-bold uppercase tracking-widest text-white/50">Includes</p>
            <p className="mt-1 text-2xl font-extrabold">Strategy, design and development</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-24">
        {featured.length ? (
          <section className="space-y-10">
            <div className="border-t border-[#1C2830]/20 pt-16">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
                Featured
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {featured.map((p: any) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-10">
          <div className="border-t border-[#1C2830]/20 pt-16">
            <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
              All portfolio
            </h2>
          </div>

          {rest.length ? (
            <div className="grid grid-cols-1 gap-8">
              {rest.map((p: any) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50">
              <h2 className="text-4xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
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
