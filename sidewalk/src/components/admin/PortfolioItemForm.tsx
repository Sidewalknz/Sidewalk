'use client'

import React, { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortfolioItem, ensureUniquePortfolioSlug, updatePortfolioItem } from '@/actions/portfolio'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { GripVertical, Image as ImageIcon, Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react'

type GalleryItem = { image: string; alt?: string; url?: string }
type InlineTeamMember = { name: string; role?: string; email?: string }
type JobItem = {
  category: string
  jobName: string
  description?: string
  price?: string | number
  monthlyFee?: string | number
  startDate?: string
  endDate?: string
}

function MediaLabelWithTooltip({
  label,
  tooltip,
}: {
  label: string
  tooltip: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">{label}</Label>
      <span className="group relative inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        ?
        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 bg-[#1C2830] p-4 text-left text-[11px] font-bold leading-5 text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          {tooltip}
        </span>
      </span>
    </div>
  )
}

function toIdString(raw: unknown): string {
  if (raw === null || raw === undefined) return ''
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw)
  if (typeof raw === 'object' && (raw as any)?.id) return String((raw as any).id)
  return ''
}

function toUrl(raw: unknown): string | undefined {
  if (!raw) return undefined
  if (typeof raw === 'object' && (raw as any)?.url) return String((raw as any).url)
  return undefined
}

function slugifyLight(raw: string) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PortfolioItemForm({
  project,
}: {
  project?: any
}) {
  const isEditing = Boolean(project?.id)
  const router = useRouter()

  const [title, setTitle] = useState<string>(project?.title || '')
  const [slug, setSlug] = useState<string>(project?.slug || '')
  const [slugTouched, setSlugTouched] = useState<boolean>(Boolean(project?.slug))
  const [isCheckingSlug, setIsCheckingSlug] = useState<boolean>(false)
  const slugSeq = useRef(0)

  const [backgroundMedia, setBackgroundMedia] = useState<any>(() => {
    const raw = project?.backgroundMedia || project?.featuredImage
    if (!raw) return null
    return typeof raw === 'object' ? raw : { id: raw }
  })

  const [foregroundMedia, setForegroundMedia] = useState<any>(() => {
    const raw = project?.foregroundMedia
    if (!raw) return null
    return typeof raw === 'object' ? raw : { id: raw }
  })

  const [logo, setLogo] = useState<any>(() => {
    if (!project?.logo) return null
    return typeof project.logo === 'object' ? project.logo : { id: project.logo }
  })

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    if (!Array.isArray(project?.gallery)) return []
    return project.gallery
      .map((g: any) => {
        const media = g?.image
        const id = toIdString(media)
        if (!id) return null
        return {
          image: id,
          alt: g?.alt || (typeof media === 'object' ? (media?.alt || media?.filename || '') : ''),
          url: toUrl(media),
        } as GalleryItem
      })
      .filter((item: GalleryItem | null): item is GalleryItem => Boolean(item))
  })
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null)

  const [servicesText, setServicesText] = useState<string>(() => {
    const raw = Array.isArray(project?.services) ? project.services : []
    const tags = raw
      .map((s: any) => (typeof s === 'string' ? s : s?.service))
      .map((s: any) => String(s || '').trim())
      .filter(Boolean)
    return tags.join(', ')
  })

  const [jobs, setJobs] = useState<JobItem[]>(() => {
    const raw = Array.isArray(project?.jobs) ? project.jobs : []
    return raw.map((job: any) => ({
      category: String(job?.category || job?.jobType || '').trim(),
      jobName: String(job?.jobName || '').trim(),
      description: String(job?.description || '').trim(),
      price: job?.price ?? '',
      monthlyFee: job?.monthlyFee ?? '',
      startDate: job?.startDate ? String(job.startDate).slice(0, 10) : '',
      endDate: job?.endDate ? String(job.endDate).slice(0, 10) : '',
    }))
  })

  const [inlineTeam, setInlineTeam] = useState<InlineTeamMember[]>(() => {
    const raw = project?.teamMembers
    if (!Array.isArray(raw)) return []
    return raw
      .map((m: any) => {
        if (!m || typeof m !== 'object') return null
        const name = String(m?.name || '').trim()
        if (!name) return null
        const role = String(m?.role || '').trim()
        const email = String(m?.email || '').trim()
        return { name, role: role || undefined, email: email || undefined } as InlineTeamMember
      })
      .filter((item: InlineTeamMember | null): item is InlineTeamMember => Boolean(item))
  })

  const [testimonialImage, setTestimonialImage] = useState<any>(() => {
    const raw = project?.testimonial?.image
    if (!raw) return null
    return typeof raw === 'object' ? raw : { id: raw }
  })

  const [metaImage, setMetaImage] = useState<any>(() => {
    const raw = project?.seo?.metaImage
    if (!raw) return null
    return typeof raw === 'object' ? raw : { id: raw }
  })

  const action = isEditing ? updatePortfolioItem : createPortfolioItem
  const [state, formAction, isPending] = useActionState(action as any, { message: '' })

  useEffect(() => {
    if (!state?.message?.includes('success')) return
    const t = setTimeout(() => router.push('/admin/portfolio'), 900)
    return () => clearTimeout(t)
  }, [state, router])

  const refreshSlugFromTitle = async () => {
    const base = slugifyLight(title)
    if (!base) return

    const seq = (slugSeq.current += 1)
    setIsCheckingSlug(true)
    try {
      const unique = await ensureUniquePortfolioSlug(base, isEditing ? project?.id : undefined)
      if (slugSeq.current !== seq) return
      setSlug(unique || base)
      setSlugTouched(false)
    } finally {
      if (slugSeq.current === seq) setIsCheckingSlug(false)
    }
  }

  useEffect(() => {
    if (isEditing) return
    if (!title) return
    if (slugTouched) return

    const base = slugifyLight(title)
    if (!base) return

    setSlug(base)

    const seq = (slugSeq.current += 1)
    setIsCheckingSlug(true)

    const t = setTimeout(() => {
      ensureUniquePortfolioSlug(base)
        .then((unique) => {
          if (slugSeq.current !== seq) return
          setSlug(unique || base)
        })
        .finally(() => {
          if (slugSeq.current === seq) setIsCheckingSlug(false)
        })
    }, 350)

    return () => clearTimeout(t)
  }, [title, slugTouched, isEditing])

  const payloadJson = useMemo(() => {
    const services = servicesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return {
      gallery: JSON.stringify((gallery || []).map(({ image, alt }) => ({ image, alt }))),
      services: JSON.stringify(services),
      jobs: JSON.stringify((jobs || []).filter((job) => job?.category?.trim() || job?.jobName?.trim())),
      teamMembers: JSON.stringify((inlineTeam || []).filter((m) => m?.name && String(m.name).trim().length > 0)),
    }
  }, [gallery, servicesText, jobs, inlineTeam])

  const addGalleryImage = (media: any) => {
    const id = toIdString(media)
    if (!id) return
    setGallery((prev) => {
      if (prev.some((x) => x.image === id)) return prev
      const alt = typeof media === 'object' ? (media?.alt || media?.filename || '') : ''
      const url = toUrl(media)
      return [...prev, { image: id, alt, url }]
    })
  }

  const addGalleryImages = (items: any[]) => {
    if (!Array.isArray(items) || !items.length) return
    items.forEach((m) => addGalleryImage(m))
  }

  const moveGalleryImage = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return
    setGallery((prev) => {
      if (from >= prev.length || to >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const updateJob = (idx: number, patch: Partial<JobItem>) => {
    setJobs((prev) => prev.map((job, i) => (i === idx ? { ...job, ...patch } : job)))
  }

  const stateTone =
    state?.message?.includes('success')
      ? 'text-emerald-600 dark:text-emerald-400'
      : state?.message?.includes('error')
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-slate-500 dark:text-slate-400'

  return (
    <form action={formAction} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input type="hidden" name="id" value={project?.id || ''} />
      <input type="hidden" name="logo" value={toIdString(logo)} />
      <input type="hidden" name="backgroundMedia" value={toIdString(backgroundMedia)} />
      <input type="hidden" name="foregroundMedia" value={toIdString(foregroundMedia)} />
      <input type="hidden" name="gallery" value={payloadJson.gallery} />
      <input type="hidden" name="servicesText" value={servicesText} />
      <input type="hidden" name="jobs" value={payloadJson.jobs} />
      <input type="hidden" name="teamMembers" value={payloadJson.teamMembers} />
      <input type="hidden" name="metaImage" value={toIdString(metaImage)} />
      <input type="hidden" name="testimonialImage" value={toIdString(testimonialImage)} />

      <AdminEditorLayout
        leftClassName="bg-transparent border-none shadow-none p-0"
        sidebar={
          <AdminEditorSidebarCard>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="clientStatus" className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                  Client status
                </Label>
                <select
                  id="clientStatus"
                  name="clientStatus"
                  defaultValue={project?.clientStatus || 'active'}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-black appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase tracking-widest text-white"
                >
                  <option value="lead" className="text-slate-900 font-bold bg-white">
                    Lead
                  </option>
                  <option value="active" className="text-slate-900 font-bold bg-white">
                    Active
                  </option>
                  <option value="paused" className="text-slate-900 font-bold bg-white">
                    Paused
                  </option>
                  <option value="complete" className="text-slate-900 font-bold bg-white">
                    Complete
                  </option>
                  <option value="archived" className="text-slate-900 font-bold bg-white">
                    Archived
                  </option>
                </select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="status" className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={project?.status || 'draft'}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-black appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all uppercase tracking-widest text-white"
                >
                  <option value="draft" className="text-slate-900 font-bold bg-white">
                    Draft
                  </option>
                  <option value="published" className="text-slate-900 font-bold bg-white">
                    Published
                  </option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Visibility</Label>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Featured</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Visible</span>
                      <Switch name="featured" defaultChecked={Boolean(project?.featured)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Homepage</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Visible</span>
                      <Switch name="isFeaturedOnHomepage" defaultChecked={Boolean(project?.isFeaturedOnHomepage)} />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-16 rounded-[1.5rem] bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-600/20 disabled:opacity-50"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-3">
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <Save size={18} strokeWidth={3} />
                    {isEditing ? 'Update' : 'Create'}
                  </span>
                )}
              </Button>

              {state?.message ? (
                <div className={cn('text-[10px] font-black uppercase tracking-widest ml-1', stateTone)}>
                  {state.message.replace(/^success:\\s*/i, '').replace(/^error:\\s*/i, '')}
                </div>
              ) : null}
            </div>
          </AdminEditorSidebarCard>
        }
      >
        <Card className="border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-10">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="flex flex-wrap justify-center w-full h-auto p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl gap-1">
                {['content', 'media', 'client', 'jobs', 'seo'].map((k) => (
                  <TabsTrigger
                    key={k}
                    value={k}
                    className="rounded-full px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {k}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent forceMount value="content" className="pt-8 space-y-8 data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="title" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Portfolio item name"
                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="slug" className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 ml-1">
                    Slug
                  </Label>
                  <div className="relative">
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value)
                        setSlugTouched(true)
                      }}
                      placeholder="portfolio-item-slug"
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-black pr-14"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-brand-600 transition-colors"
                      title="Refresh from title"
                      onClick={refreshSlugFromTitle}
                      disabled={!title || isCheckingSlug}
                    >
                      {isCheckingSlug ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label
                  htmlFor="shortDescription"
                  className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1"
                >
                  Short description
                </Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={project?.shortDescription || ''}
                  placeholder="A short summary for cards and listing pages..."
                  className="min-h-28 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="overview" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                  Overview
                </Label>
                <Textarea
                  id="overview"
                  name="overview"
                  defaultValue={project?.overview || ''}
                  placeholder="Portfolio overview..."
                  className="min-h-40 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="projectDetails" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                  Internal project details
                </Label>
                <Textarea
                  id="projectDetails"
                  name="projectDetails"
                  defaultValue={project?.projectDetails || ''}
                  placeholder="Internal scope, notes, and project details..."
                  className="min-h-32 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                />
              </div>

              <div className="space-y-8">
                {['challenge', 'solution', 'outcome'].map((k) => (
                  <div key={k} className="space-y-4">
                    <Label htmlFor={k} className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                      {k}
                    </Label>
                    <Textarea
                      id={k}
                      name={k}
                      defaultValue={(project as any)?.[k] || ''}
                      className="min-h-40 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent forceMount value="media" className="pt-8 space-y-10 data-[state=inactive]:hidden">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">Logo</Label>
                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                    <div className="w-40">
                      <MediaPicker
                        onSelect={(m) => setLogo(m)}
                        selected={logo}
                        aspectRatio="h-20"
                        subtitle="Select or upload a client logo"
                      />
                    </div>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      defaultValue={project?.logoUrl || ''}
                      placeholder="External logo URL (optional)"
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="space-y-4">
                    <MediaLabelWithTooltip
                      label="Background media"
                      tooltip="Best at 2400 x 900px, minimum 1600 x 600px. Use this for the wide scene, texture, screenshot, or video behind the card text."
                    />
                    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                      <div className="w-40">
                        <MediaPicker
                          onSelect={(m) => setBackgroundMedia(m)}
                          selected={backgroundMedia}
                          aspectRatio="h-20"
                          accept="image/*,video/*"
                          subtitle="Select or upload a background image or video"
                        />
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                          {(backgroundMedia as any)?.url ? (
                            (backgroundMedia as any)?.mimeType?.startsWith?.('video/') ? (
                              <video src={(backgroundMedia as any).url} className="w-full h-full object-cover" muted playsInline />
                            ) : (
                              <img src={(backgroundMedia as any).url} alt={project?.backgroundMediaAlt || project?.featuredImageAlt || ''} className="w-full h-full object-cover" />
                            )
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                          )}
                        </div>
                        <Input
                          id="backgroundMediaAlt"
                          name="backgroundMediaAlt"
                          defaultValue={project?.backgroundMediaAlt || project?.featuredImageAlt || ''}
                          placeholder="Background alt text..."
                          className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setBackgroundMedia(null)}
                          className="h-11 w-11 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600"
                          title="Remove background media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <MediaLabelWithTooltip
                      label="Foreground media"
                      tooltip="Best on a 1600 x 900px transparent canvas. Use this for a cutout, device mockup, product, or transparent video that floats above the card."
                    />
                    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                      <div className="w-40">
                        <MediaPicker
                          onSelect={(m) => setForegroundMedia(m)}
                          selected={foregroundMedia}
                          aspectRatio="h-20"
                          accept="image/*,video/*"
                          subtitle="Select or upload a transparent foreground image or video"
                        />
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                          {(foregroundMedia as any)?.url ? (
                            (foregroundMedia as any)?.mimeType?.startsWith?.('video/') ? (
                              <video src={(foregroundMedia as any).url} className="w-full h-full object-contain" muted playsInline />
                            ) : (
                              <img src={(foregroundMedia as any).url} alt={project?.foregroundMediaAlt || ''} className="w-full h-full object-contain" />
                            )
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                          )}
                        </div>
                        <Input
                          id="foregroundMediaAlt"
                          name="foregroundMediaAlt"
                          defaultValue={project?.foregroundMediaAlt || ''}
                          placeholder="Foreground alt text..."
                          className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setForegroundMedia(null)}
                          className="h-11 w-11 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600"
                          title="Remove foreground media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">Gallery</Label>
                  <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                    <div className="w-40">
                      <MediaPicker
                        onSelect={addGalleryImage}
                        onSelectMany={addGalleryImages}
                        multiple
                        excludeIds={(gallery || []).map((g) => g.image)}
                        showSelection={false}
                        aspectRatio="h-20"
                        subtitle="Add an image to the portfolio gallery"
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Drag and drop images to reorder. The first image will appear first on the frontend.
                    </p>

                    <div className="space-y-3">
                      {gallery.map((g, idx) => (
                        <div
                          key={`${g.image}-${idx}`}
                          draggable
                          onDragStart={() => setDraggedGalleryIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedGalleryIndex !== null) moveGalleryImage(draggedGalleryIndex, idx)
                            setDraggedGalleryIndex(null)
                          }}
                          onDragEnd={() => setDraggedGalleryIndex(null)}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all',
                            draggedGalleryIndex === idx ? 'opacity-50 ring-2 ring-brand-500/40' : 'cursor-grab active:cursor-grabbing'
                          )}
                        >
                          <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                          <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                            {g.url ? (
                              <img src={g.url} alt={g.alt || ''} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                            )}
                          </div>
                          <Input
                            value={g.alt || ''}
                            onChange={(e) =>
                              setGallery((prev) => prev.map((x, i) => (i === idx ? { ...x, alt: e.target.value } : x)))
                            }
                            placeholder="Alt text..."
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                            className="h-11 w-11 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent forceMount value="client" className="pt-8 space-y-8 data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'clientCompany', label: 'Client company', placeholder: 'Company or organisation name' },
                  { id: 'websiteUrl', label: 'Website URL', placeholder: 'https://example.com' },
                  { id: 'ownerName', label: 'Owner name', placeholder: 'Business owner' },
                  { id: 'ownerEmail', label: 'Owner email', placeholder: 'owner@example.com', type: 'email' },
                  { id: 'contactName', label: 'Contact name', placeholder: 'Primary contact' },
                  { id: 'contactEmail', label: 'Contact email', placeholder: 'contact@example.com', type: 'email' },
                ].map((f) => (
                  <div key={f.id} className="space-y-4">
                    <Label htmlFor={f.id} className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                      {f.label}
                    </Label>
                    <Input
                      id={f.id}
                      name={f.id}
                      type={(f as any).type || 'text'}
                      defaultValue={(project as any)?.[f.id] || ''}
                      placeholder={f.placeholder}
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                  </div>
                ))}

              </div>
            </TabsContent>

            <TabsContent forceMount value="jobs" className="pt-8 space-y-10 data-[state=inactive]:hidden">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Public portfolio details
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'industry', label: 'Industry', placeholder: 'e.g. Hospitality, construction, SaaS' },
                  { id: 'location', label: 'Location', placeholder: 'e.g. Nelson, NZ' },
                  { id: 'projectType', label: 'Project type', placeholder: 'e.g. Website, branding, installation' },
                ].map((f) => (
                  <div key={f.id} className="space-y-4">
                    <Label htmlFor={f.id} className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                      {f.label}
                    </Label>
                    <Input
                      id={f.id}
                      name={f.id}
                      defaultValue={(project as any)?.[f.id] || ''}
                      placeholder={f.placeholder}
                      className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                  </div>
                ))}

                <div className="space-y-4">
                  <Label htmlFor="completionDate" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                    Completion date
                  </Label>
                  <Input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    defaultValue={project?.completionDate ? String(project.completionDate).slice(0, 10) : ''}
                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                  Services (comma-separated)
                </Label>
                <Input
                  value={servicesText}
                  onChange={(e) => setServicesText(e.target.value)}
                  placeholder="e.g. Design, Development, SEO"
                  className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="featuresText" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                    Features (comma-separated)
                  </Label>
                  <Textarea
                    id="featuresText"
                    name="featuresText"
                    defaultValue={(Array.isArray(project?.features) ? project.features : []).map((f: any) => f?.feature || f).filter(Boolean).join(', ')}
                    placeholder="e.g. CMS, booking flow, customer portal"
                    className="min-h-28 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="constraintsText" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                    Constraints (comma-separated)
                  </Label>
                  <Textarea
                    id="constraintsText"
                    name="constraintsText"
                    defaultValue={(Array.isArray(project?.constraints) ? project.constraints : []).map((c: any) => c?.constraint || c).filter(Boolean).join(', ')}
                    placeholder="e.g. Tight deadline, legacy integrations"
                    className="min-h-28 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                    Internal jobs / projects
                  </Label>
                  <Button
                    type="button"
                    onClick={() =>
                      setJobs((prev) => [
                        ...prev,
                        { category: '', jobName: '', description: '', price: '', monthlyFee: '', startDate: '', endDate: '' },
                      ])
                    }
                    className="h-10 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {jobs.map((job, idx) => (
                    <div
                      key={`job-${idx}`}
                      className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Item {idx + 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setJobs((prev) => prev.filter((_, i) => i !== idx))}
                          className="h-10 w-10 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600"
                          title="Remove job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            Category
                          </Label>
                          <Input
                            value={job.category}
                            onChange={(e) => updateJob(idx, { category: e.target.value })}
                            placeholder="e.g. Website, hosting, signage"
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            Job name
                          </Label>
                          <Input
                            value={job.jobName}
                            onChange={(e) => updateJob(idx, { jobName: e.target.value })}
                            placeholder="e.g. Main website build"
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                          Description
                        </Label>
                        <Textarea
                          value={job.description || ''}
                          onChange={(e) => updateJob(idx, { description: e.target.value })}
                          placeholder="What was delivered?"
                          className="min-h-24 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            Price
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={job.price ?? ''}
                            onChange={(e) => updateJob(idx, { price: e.target.value })}
                            placeholder="0"
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            Monthly fee
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={job.monthlyFee ?? ''}
                            onChange={(e) => updateJob(idx, { monthlyFee: e.target.value })}
                            placeholder="0"
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            Start date
                          </Label>
                          <Input
                            type="date"
                            value={job.startDate || ''}
                            onChange={(e) => updateJob(idx, { startDate: e.target.value })}
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                            End date
                          </Label>
                          <Input
                            type="date"
                            value={job.endDate || ''}
                            onChange={(e) => updateJob(idx, { endDate: e.target.value })}
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {!jobs.length ? (
                    <div className="py-12 text-center rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-200">No jobs or projects added</div>
                      <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
                        Add the work, product, or service delivered for this client.
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">Team</Label>
                    <button
                      type="button"
                      onClick={() => setInlineTeam((prev) => [...(prev || []), { name: '' }])}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-500 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inlineTeam.map((m, idx) => (
                      <div
                        key={`${m.name}-${idx}`}
                        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <Input
                            value={m.name}
                            onChange={(e) =>
                              setInlineTeam((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x))
                              )
                            }
                            placeholder="Name"
                            className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setInlineTeam((prev) => prev.filter((_, i) => i !== idx))}
                            className="h-11 w-11 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={m.role || ''}
                          onChange={(e) =>
                            setInlineTeam((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, role: e.target.value } : x))
                            )
                          }
                          placeholder="Role (optional)"
                          className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                        />
                        <Input
                          value={m.email || ''}
                          onChange={(e) =>
                            setInlineTeam((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, email: e.target.value } : x))
                            )
                          }
                          placeholder="Email (optional)"
                          type="email"
                          className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                        />
                      </div>
                    ))}

                    {!inlineTeam.length ? (
                      <div className="py-10 text-center rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                        <div className="text-[10px] font-black uppercase tracking-widest">No team members</div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">Testimonial</Label>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4">
                    <Input
                      name="testimonialName"
                      defaultValue={project?.testimonial?.name || ''}
                      placeholder="Name (optional)"
                      className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                    <Input
                      name="testimonialRating"
                      type="number"
                      min={1}
                      max={5}
                      defaultValue={project?.testimonial?.rating ?? 5}
                      placeholder="Rating (1-5)"
                      className="h-11 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                    <Textarea
                      name="testimonialMessage"
                      defaultValue={project?.testimonial?.message || ''}
                      placeholder="Message (optional)"
                      className="min-h-28 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                    />
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 p-3">
                      <div className="w-40">
                        <MediaPicker
                          onSelect={(m) => setTestimonialImage(m)}
                          selected={testimonialImage}
                          subtitle="Select a testimonial image (optional)"
                          aspectRatio="h-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              </TabsContent>

              <TabsContent forceMount value="seo" className="pt-8 space-y-8 data-[state=inactive]:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="metaTitle" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                    Meta title
                  </Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    defaultValue={project?.seo?.metaTitle || ''}
                    className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">Meta image</Label>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 p-4">
                    <div className="w-40">
                      <MediaPicker onSelect={(m) => setMetaImage(m)} selected={metaImage} subtitle="Select a meta/OG image" aspectRatio="h-20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="metaDescription" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 ml-1">
                  Meta description
                </Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={project?.seo?.metaDescription || ''}
                  className="min-h-32 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold"
                />
              </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AdminEditorLayout>
    </form>
  )
}
