import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUploadFileById, updateUploadFile } from '@/actions/media'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminEditorLayout } from '@/components/admin/AdminEditorLayout'
import { AdminEditorSidebarCard } from '@/components/admin/AdminEditorSidebarCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Save } from 'lucide-react'

export default async function MediaEditPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>
}) {
  const { collection, id } = await params

  const item = await getUploadFileById(collection, id).catch(() => null)
  if (!item) notFound()

  const resolvedCollection = collection || 'media'
  const filename = (item as any)?.filename || (item as any)?.name || 'File'
  const url = (item as any)?.url as string | undefined
  const mimeType = (item as any)?.mimeType as string | undefined
  const alt = (item as any)?.alt as string | undefined
  const name = (item as any)?.name as string | undefined

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AdminPageHeader
        title="Edit Media"
        subtitle={resolvedCollection === 'media' ? 'Update file metadata' : `Collection: ${resolvedCollection}`}
        backHref="/admin/media"
        backTitle="Back to media"
      />

      <form
        action={async (formData) => {
          'use server'
          const nextName = String(formData.get('name') || '').trim()
          const nextAlt = String(formData.get('alt') || '').trim()
          await updateUploadFile(resolvedCollection, id, {
            name: nextName || undefined,
            alt: nextAlt || undefined,
          })
        }}
      >
        <AdminEditorLayout
          sidebar={
            <div className="space-y-8">
              <AdminEditorSidebarCard>
                <Button
                  type="submit"
                  className="w-full h-16 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group border-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Save Changes</span>
                    <Save className="w-4 h-4" strokeWidth={3} />
                  </div>
                </Button>
              </AdminEditorSidebarCard>
            </div>
          }
        >
          <div className="space-y-10">
            <div className="rounded-[2.5rem] bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-8 space-y-8 shadow-xl shadow-slate-200/10 dark:shadow-none">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex items-start gap-6 min-w-0">
                  <div className="w-28 h-28 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                    {url && mimeType?.startsWith('image/') ? (
                      <Image src={url} alt={alt || filename} width={112} height={112} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black text-slate-900 dark:text-white truncate">{filename}</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">
                      {mimeType || 'unknown type'} {resolvedCollection !== 'media' ? `• ${resolvedCollection}` : ''}
                    </p>
                  </div>
                </div>

              {url ? null : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={name || ''}
                  placeholder="e.g. Homepage hero image"
                  className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-700 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Alt text
                </Label>
                <Input
                  id="alt"
                  name="alt"
                  defaultValue={alt || ''}
                  placeholder="Describe the image for SEO/accessibility"
                  className="h-14 rounded-2xl border-slate-200/60 dark:border-slate-700 bg-slate-50/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </AdminEditorLayout>
      </form>
    </div>
  )
}
