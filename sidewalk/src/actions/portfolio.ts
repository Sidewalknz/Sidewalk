'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

type Id = string | number

function toId(raw: unknown): Id | undefined {
  if (raw === null || raw === undefined) return undefined
  const asString = String(raw).trim()
  if (!asString) return undefined
  return Number.isNaN(Number(asString)) ? asString : Number(asString)
}

function toNullableId(raw: unknown): Id | null {
  return toId(raw) ?? null
}

function safeJsonParse<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== 'string' || raw.trim().length === 0) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function toBool(raw: unknown): boolean {
  const v = String(raw || '').toLowerCase().trim()
  return raw === true || v === 'true' || v === 'on' || v === '1' || v === 'yes'
}

function toIsoDate(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim().length === 0) return undefined
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function toNumber(raw: unknown): number | undefined {
  if (raw === null || raw === undefined || String(raw).trim() === '') return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

function csvArray(raw: unknown, key: string) {
  return String(raw || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => ({ [key]: value }))
}

function normalizeJobs(raw: unknown) {
  return safeJsonParse<any[]>(raw, [])
    .map((job) => ({
      category: String(job?.category || job?.jobType || '').trim(),
      jobName: String(job?.jobName || '').trim(),
      description: String(job?.description || '').trim(),
      price: toNumber(job?.price),
      monthlyFee: toNumber(job?.monthlyFee),
      startDate: toIsoDate(job?.startDate),
      endDate: toIsoDate(job?.endDate),
    }))
    .filter((job) => job.category && job.jobName)
}

function normalizeInlineTeam(raw: unknown) {
  return safeJsonParse<any[]>(raw, [])
    .map((item) => ({
      name: String(item?.name || '').trim(),
      role: String(item?.role || '').trim(),
      email: String(item?.email || '').trim(),
    }))
    .filter((item) => item.name)
}

function normalizeGallery(raw: unknown) {
  return safeJsonParse<Array<{ image: string; alt?: string }>>(raw, [])
    .map((g) => ({ image: toId(g.image), alt: g.alt || '' }))
    .filter((g) => Boolean(g.image))
}

function readPortfolioForm(formData: FormData, existing?: any) {
  const status = (formData.get('status') as string) || 'draft'
  const testimonialImage = toId(formData.get('testimonialImage'))
  const testimonialName = (formData.get('testimonialName') as string) || ''
  const testimonialMessage = (formData.get('testimonialMessage') as string) || ''
  const testimonial =
    testimonialName || testimonialMessage || testimonialImage
      ? {
          name: testimonialName || undefined,
          message: testimonialMessage || undefined,
          rating: toNumber(formData.get('testimonialRating')) || 5,
          image: testimonialImage,
        }
      : undefined

  return {
    title: (formData.get('title') as string) || '',
    slug: (formData.get('slug') as string) || undefined,
    status,
    shortDescription: (formData.get('shortDescription') as string) || '',
    overview: (formData.get('overview') as string) || '',
    projectDetails: (formData.get('projectDetails') as string) || '',
    challenge: (formData.get('challenge') as string) || '',
    solution: (formData.get('solution') as string) || '',
    outcome: (formData.get('outcome') as string) || '',
    logo: toId(formData.get('logo')),
    logoUrl: (formData.get('logoUrl') as string) || '',
    backgroundMedia: toNullableId(formData.get('backgroundMedia')),
    backgroundMediaAlt: (formData.get('backgroundMediaAlt') as string) || '',
    cardTextTone: (formData.get('cardTextTone') as string) === 'dark' ? 'dark' : 'light',
    foregroundMedia: toNullableId(formData.get('foregroundMedia')),
    foregroundMediaAlt: (formData.get('foregroundMediaAlt') as string) || '',
    gallery: normalizeGallery(formData.get('gallery')),
    clientCompany: (formData.get('clientCompany') as string) || '',
    websiteUrl: (formData.get('websiteUrl') as string) || '',
    ownerName: (formData.get('ownerName') as string) || '',
    ownerEmail: (formData.get('ownerEmail') as string) || '',
    contactName: (formData.get('contactName') as string) || '',
    contactEmail: (formData.get('contactEmail') as string) || '',
    clientStatus: (formData.get('clientStatus') as string) || 'active',
    industry: (formData.get('industry') as string) || '',
    location: (formData.get('location') as string) || '',
    projectType: (formData.get('projectType') as string) || '',
    completionDate: toIsoDate(formData.get('completionDate')),
    featured: toBool(formData.get('featured')),
    isFeaturedOnHomepage: toBool(formData.get('isFeaturedOnHomepage')),
    services: csvArray(formData.get('servicesText'), 'service'),
    features: csvArray(formData.get('featuresText'), 'feature'),
    constraints: csvArray(formData.get('constraintsText'), 'constraint'),
    jobs: normalizeJobs(formData.get('jobs')),
    teamMembers: normalizeInlineTeam(formData.get('teamMembers')),
    testimonial,
    seo: {
      metaTitle: (formData.get('metaTitle') as string) || '',
      metaDescription: (formData.get('metaDescription') as string) || '',
      metaImage: toId(formData.get('metaImage')),
    },
    ...(status === 'published' && !existing?.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
  }
}

export async function getPublishedPortfolioItems() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'PortfolioItems',
    sort: ['-completionDate', '-publishedAt', '-createdAt'],
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 200,
  })
  return res.docs || []
}

export async function getHomepageFeaturedPortfolioItems(limit: number = 6) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'PortfolioItems',
    sort: ['sortOrder', '-publishedAt', '-createdAt'],
    where: { and: [{ status: { equals: 'published' } }, { isFeaturedOnHomepage: { equals: true } }] },
    depth: 2,
    limit,
  })
  return res.docs || []
}

export async function getPublishedPortfolioClientsForMarquee() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'PortfolioItems',
    sort: ['sortOrder', 'clientCompany', 'title'],
    where: {
      and: [
        { clientStatus: { not_equals: 'lead' } },
        { clientStatus: { not_equals: 'archived' } },
      ],
    },
    depth: 0,
    limit: 200,
    select: {
      title: true,
      clientCompany: true,
      slug: true,
    },
  })

  const seen = new Set<string>()

  return (res.docs || [])
    .map((item: any) => ({
      name: String(item?.clientCompany || item?.title || '').trim(),
      href: item?.slug ? `/portfolio/${item.slug}` : '/portfolio',
    }))
    .filter((item) => {
      if (!item.name || seen.has(item.name)) return false
      seen.add(item.name)
      return true
    })
}

export async function getPortfolioItemBySlug(slug: string) {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'PortfolioItems',
    limit: 1,
    depth: 3,
    where: { and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }] },
  })
  return res?.docs?.[0] || null
}

export async function getPortfolioItemById(id: Id) {
  const payload = await getPayload({ config })
  return payload.findByID({ collection: 'PortfolioItems', id: String(id), depth: 3 })
}

export async function ensureUniquePortfolioSlug(baseSlug: string, excludeId?: string | number) {
  const payload = await getPayload({ config })
  const normalized = String(baseSlug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  if (!normalized) return ''

  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? normalized : `${normalized}-${i}`
    const where: any = { and: [{ slug: { equals: candidate } }] }
    if (excludeId) where.and.push({ id: { not_equals: excludeId } })
    const res = await payload.find({ collection: 'PortfolioItems', limit: 1, depth: 0, where })
    if (!res?.docs?.length) return candidate
  }

  return `${normalized}-${Date.now()}`
}

export async function getPortfolioItemsAdmin(
  search?: string,
  sort: string = '-createdAt',
  clientStatus?: string,
  page: number = 1,
  limit: number = 1000
) {
  const payload = await getPayload({ config })
  const query: any = { collection: 'PortfolioItems', sort, page, limit, depth: 1 }
  const and: any[] = []

  if (search) {
    and.push({
      or: [
        { title: { contains: search } },
        { clientCompany: { contains: search } },
        { shortDescription: { contains: search } },
        { projectType: { contains: search } },
      ],
    })
  }

  if (clientStatus && clientStatus !== 'all') {
    and.push({ clientStatus: { equals: clientStatus } })
  }

  if (and.length) query.where = { and }

  return payload.find(query)
}

export async function deletePortfolioItem(id: Id) {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'PortfolioItems', id: String(id) })
  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
}

export async function createPortfolioItem(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    await payload.create({ collection: 'PortfolioItems', data: readPortfolioForm(formData) as any })
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    return { message: 'success: Portfolio item created successfully' }
  } catch (error: any) {
    console.error('Error in createPortfolioItem:', JSON.stringify(error, null, 2))
    if (error.data?.errors) {
      const fieldErrors = error.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
      return { message: `error: Validation Failed: ${fieldErrors}` }
    }
    return { message: `error: ${error.message || 'Failed to create portfolio item'}` }
  }
}

export async function updatePortfolioItem(prevState: any, formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const id = (formData.get('id') as string) || ''
    const existing = await payload.findByID({ collection: 'PortfolioItems', id, depth: 0 }).catch(() => null as any)
    await payload.update({ collection: 'PortfolioItems', id, data: readPortfolioForm(formData, existing) as any })
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    revalidatePath(`/admin/portfolio/${id}`)
    return { message: 'success: Portfolio item updated successfully' }
  } catch (error: any) {
    console.error('Error in updatePortfolioItem:', JSON.stringify(error, null, 2))
    if (error.data?.errors) {
      const fieldErrors = error.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
      return { message: `error: Validation Failed: ${fieldErrors}` }
    }
    return { message: `error: ${error.message || 'Failed to update portfolio item'}` }
  }
}
