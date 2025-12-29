import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch all clients
    const clients = await payload.find({
      collection: 'clients',
      depth: 2, // Populate relationships (media, gallery images)
      limit: 100,
      sort: 'companyName',
    })

    // Transform Payload clients to Project format
    const projects = clients.docs.map((client) => {
      // Get gallery image URLs
      const gallery = client.gallery
        ?.filter((item: any) => item.image && typeof item.image === 'object')
        .map((item: any) => {
          // If image is a populated media object, get the URL
          if (item.image?.url) {
            return item.image.url
          }
          // If it's just an ID, we'd need to handle that differently
          return typeof item.image === 'string' ? item.image : ''
        })
        .filter((url: string) => url) || []

      // Get features as string array
      const features = client.features
        ?.map((feature: any) => feature.feature)
        .filter((f: string) => f) || []

      return {
        id: client.id,
        name: client.companyName?.toLowerCase() || '',
        description: client.description || '',
        features: features,
        gallery: gallery,
        website: client.website || undefined,
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

