import type { CollectionConfig } from 'payload'
import { cleanupDeletedMediaReferences } from '@/hooks/cleanupDeletedAssetReferences'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
    useAsTitle: 'alt',
  },
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        await cleanupDeletedMediaReferences(req as any, id)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    staticDir: 'media',
    adminThumbnail: (doc: any) => doc.url,
    // Allow all common file types (images, video, audio, documents, CSV, etc).
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'text/*', 'application/*'],
  },
}
