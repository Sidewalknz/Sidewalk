'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

function normalizeUploadedMimeType(file: File): string {
    const original = (file?.type || '').trim()
    const name = (file as any)?.name ? String((file as any).name) : ''
    const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : ''

    // Some environments report CSV as application/vnd.ms-excel.
    if (ext === 'csv' && (!original || original === 'application/vnd.ms-excel')) return 'text/csv'

    return original || 'application/octet-stream'
}

function normalizeCollectionSlug(slug?: string) {
    return slug && slug.length ? slug : 'media'
}

const DEFAULT_UPLOAD_COLLECTION_SLUGS = ['media']

function getUploadCollectionSlugsFromConfig(): string[] {
    const collections = (config as any)?.collections
    if (!Array.isArray(collections)) return DEFAULT_UPLOAD_COLLECTION_SLUGS

    const slugs = collections
        .map((c: any) => ({ slug: c?.slug, upload: c?.upload }))
        .filter((c: any) => typeof c.slug === 'string' && Boolean(c.slug) && Boolean(c.upload))
        .map((c: any) => String(c.slug))

    return Array.from(new Set([...DEFAULT_UPLOAD_COLLECTION_SLUGS, ...slugs]))
}

export async function getUploadCollections() {
    // Kept synchronous on config; still an async export for server-action usage consistency.
    return getUploadCollectionSlugsFromConfig()
}

export async function getMedia(search?: string, collection?: string) {
    const payload = await getPayload({ config })
    const resolvedCollection = normalizeCollectionSlug(collection)
    
    const query: any = {
        collection: resolvedCollection,
        sort: '-createdAt',
        limit: 100,
    }

    if (search) {
        query.where = {
            or: [
                { filename: { contains: search } },
                { alt: { contains: search } },
                { name: { contains: search } },
            ],
        }
    }

    const media = await payload.find(query)
    return media.docs
}

export async function getMediaPaged(
    search?: string,
    sort: string = '-createdAt',
    page: number = 1,
    limit: number = 10,
    collection?: string,
) {
    const payload = await getPayload({ config })
    const resolvedCollection = normalizeCollectionSlug(collection)

    const query: any = {
        collection: resolvedCollection,
        sort,
        page,
        limit,
    }

    if (search) {
        query.where = {
            or: [
                { filename: { contains: search } },
                { alt: { contains: search } },
                { name: { contains: search } },
            ],
        }
    }

    return payload.find(query)
}

export async function getUploadFileById(collection: string, id: string | number) {
    const payload = await getPayload({ config })
    const resolvedCollection = normalizeCollectionSlug(collection)

    return payload.findByID({
        collection: resolvedCollection as any,
        id: typeof id === 'string' ? id : id.toString(),
    })
}

export async function updateUploadFile(
    collection: string,
    id: string | number,
    data: { alt?: string; name?: string },
) {
    const payload = await getPayload({ config })
    const resolvedCollection = normalizeCollectionSlug(collection)

    await payload.update({
        collection: resolvedCollection as any,
        id: typeof id === 'string' ? id : id.toString(),
        data,
    })

    revalidatePath('/admin/media')
}

export async function createMedia(formData: FormData, collection?: string): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    const embedded = formData.get('collection') as string
    const resolvedCollection = normalizeCollectionSlug(collection || embedded)
    
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    
    if (!file) {
        return { message: 'No file selected.' }
    }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const derivedName = file.name.replace(/\.[^/.]+$/, '')

        await payload.create({
            collection: resolvedCollection as any,
            data: {
                name: derivedName || file.name,
                alt: alt || file.name,
            },
            file: {
                data: buffer,
                mimetype: normalizeUploadedMimeType(file),
                name: file.name,
                size: file.size,
            },
        })
    } catch (error: any) {
        console.error('Error uploading media:', JSON.stringify(error, null, 2))
        
        // Extract specific field error if available
        if (error.data?.errors) {
            const fieldErrors = error.data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
            return { message: `Validation Error: ${fieldErrors}` }
        }

        return { message: error.message || 'Failed to upload media.' }
    }

    revalidatePath('/admin/media')
    return { message: 'Success' }
}

type MediaBulkFailure = {
    filename?: string
    message: string
}

export async function createMediaBulk(formData: FormData) {
    const payload = await getPayload({ config })

    const files = (formData.getAll('files') as unknown[]).filter(Boolean) as File[]
    const embeddedCollection = formData.get('collection') as string
    const resolvedCollection = normalizeCollectionSlug(embeddedCollection)

    if (!files.length) {
        return { success: false, createdCount: 0, errorCount: 1, errors: [{ message: 'No files selected.' }] as MediaBulkFailure[] }
    }

    const errors: MediaBulkFailure[] = []
    let createdCount = 0

    for (const file of files) {
        try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const derivedName = file.name.replace(/\.[^/.]+$/, '')

            await payload.create({
                collection: resolvedCollection as any,
                data: {
                    name: derivedName || file.name,
                    alt: derivedName || file.name,
                },
                file: {
                    data: buffer,
                    mimetype: normalizeUploadedMimeType(file),
                    name: file.name,
                    size: file.size,
                },
            })

            createdCount++
        } catch (error: any) {
            console.error('Error uploading media (bulk):', file?.name, JSON.stringify(error, null, 2))
            errors.push({
                filename: file?.name,
                message: error?.message || 'Failed to upload file.',
            })
        }
    }

    revalidatePath('/admin/media')
    return { success: errors.length === 0, createdCount, errorCount: errors.length, errors }
}

export async function updateMediaAlt(id: string | number, alt: string) {
    const payload = await getPayload({ config })
    
    try {
        await payload.update({
            collection: 'media',
            id: typeof id === 'string' ? id : id.toString(),
            data: {
                alt,
            },
        })
        revalidatePath('/admin/media')
    } catch (error) {
        console.error('Error updating media alt:', error)
        throw error
    }
}

export async function bulkUpdateMedia(updates: { id: string, collection?: string, data: { alt?: string, name?: string } }[]) {
    const payload = await getPayload({ config })

    let updatedCount = 0
    let errorCount = 0

    for (const update of updates) {
        try {
            await payload.update({
                collection: normalizeCollectionSlug(update.collection) as any,
                id: update.id,
                data: update.data,
            })
            updatedCount++
        } catch (e) {
            console.error(`Error updating media ${update.id}`, e)
            errorCount++
        }
    }

    revalidatePath('/admin/media')
    return { success: true, updatedCount, errorCount }
}

export async function deleteMedia(id: string | number) {
    const payload = await getPayload({ config })
    const strId = typeof id === 'string' ? id : id.toString()
    
    try {
        await payload.delete({
            collection: 'media',
            id: strId,
        })
        revalidatePath('/admin/media')
    } catch (error) {
        console.error('Error deleting media:', error)
        throw error
    }
}

export async function deleteUploadFile(collection: string, id: string | number) {
    const payload = await getPayload({ config })
    const strId = typeof id === 'string' ? id : id.toString()
    const allowed = new Set(getUploadCollectionSlugsFromConfig())

    if (!allowed.has(collection)) {
        throw new Error(`Invalid upload collection: ${collection}`)
    }

    try {
        await payload.delete({
            collection: collection as any,
            id: strId,
        })
        revalidatePath('/admin/media')
    } catch (error) {
        console.error('Error deleting upload file:', collection, error)
        throw error
    }
}
