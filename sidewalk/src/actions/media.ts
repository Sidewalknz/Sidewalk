'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function getMedia() {
    const payload = await getPayload({ config })
    const media = await payload.find({
        collection: 'media',
        sort: '-createdAt',
        limit: 100, // Reasonable limit for now
    })
    return media.docs
}

export async function createMedia(formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    // Check if file is provided
    const file = formData.get('file') as File
    
    if (!file) {
        return { message: 'No file selected.' }
    }

    try {
        await payload.create({
            collection: 'media',
            data: {
                alt: file.name, // Default alt text to filename
            },
            file: file, // Payload handles file upload from the File object
        })
    } catch (error) {
        console.error('Error uploading media:', error)
        return { message: 'Failed to upload media.' }
    }

    revalidatePath('/admin/media')
    return { message: 'Success' }
}

export async function deleteMedia(id: number) {
    const payload = await getPayload({ config })
    
    try {
        await payload.delete({
            collection: 'media',
            id,
        })
        revalidatePath('/admin/media')
    } catch (error) {
        console.error('Error deleting media:', error)
        throw error
    }
}
