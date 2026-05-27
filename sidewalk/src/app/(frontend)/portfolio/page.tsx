import { getPublishedPortfolioItems } from '@/actions/portfolio'
import { PageCTA } from '@/components/frontend/PageCTA'
import { PortfolioCard } from '@/components/frontend/PortfolioCard'
import { SidewalkHero } from '@/components/frontend/Hero'
import { Reveal } from '@/components/frontend/Reveal'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Web Design Projects Nelson',
  description:
    'Explore Sidewalk web design and web development projects from a Nelson NZ web agency building practical websites and digital systems.',
}

export default async function PortfolioPage() {
  const portfolioItems = await getPublishedPortfolioItems()

  const featured = portfolioItems.filter((p: any) => p?.featured)
  const rest = portfolioItems.filter((p: any) => !p?.featured)

  return (
    <div>
      <SidewalkHero
        title="Projects"
        description="A selection of websites, ecommerce stores, and custom web projects built to be practical, manageable, and useful long after launch."
        highlights={['websites', 'ecommerce stores', 'custom web projects', 'long after launch']}
      />

      <section className="bg-[#1C2830] py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 sm:px-6 md:grid-cols-3 md:gap-8 lg:px-8">
          {[
            ['Project type', 'Websites and web systems'],
            ['Built for', 'Real business workflows'],
            ['Includes', 'Strategy, design and development'],
          ].map(([label, value], index) => (
            <Reveal key={label} delay={100 + index * 100}>
              <div className="border-l border-white/20 pl-5 md:pl-6">
                <p className="text-sm font-bold uppercase tracking-widest text-white/50">{label}</p>
                <p className="mt-1 text-xl font-extrabold leading-tight md:text-2xl">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-16 sm:px-6 md:space-y-20 md:pb-24 lg:px-8">
        {featured.length ? (
          <section className="space-y-7 md:space-y-10">
            <Reveal>
              <div className="border-t border-[#1C2830]/20 pt-12 md:pt-16">
                <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
                  Featured
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {featured.map((p: any, index: number) => (
                <Reveal key={p.id} delay={100 + index * 100}>
                  <PortfolioCard project={p} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-7 md:space-y-10">
          <Reveal>
            <div className="border-t border-[#1C2830]/20 pt-12 md:pt-16">
              <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
                All portfolio
              </h2>
            </div>
          </Reveal>

          {rest.length ? (
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {rest.map((p: any, index: number) => (
                <Reveal key={p.id} delay={100 + index * 100}>
                  <PortfolioCard project={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={100}>
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-800/50 dark:bg-slate-900/40 md:py-24">
                <h2 className="text-3xl font-extrabold leading-tight text-[#1C2830] dark:text-white md:text-6xl">
                  Portfolio items are coming soon
                </h2>
                <p className="mx-auto mt-4 max-w-sm font-medium text-slate-500 dark:text-slate-400">
                  Add portfolio items through the admin panel to see them here.
                </p>
              </div>
            </Reveal>
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
