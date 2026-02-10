'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClient(prevState: any, formData: FormData): Promise<{ message: string }> {
  const payload = await getPayload({ config })

  const companyName = formData.get('companyName') as string
  const ownerName = formData.get('ownerName') as string
  const email = formData.get('email') as string
  const website = formData.get('website') as string
  const type = formData.get('type') as 'ecommerce' | 'portfolio' | 'business' | 'blog' | 'other'
  const status = formData.get('status') as 'in_progress' | 'completed' | 'in_talks' | 'completed_hide'


  const description = formData.get('description') as string


  // Extract products
  const products: any[] = []
  let i = 0
  while (formData.has(`products[${i}][productName]`)) {
    products.push({
      category: formData.get(`products[${i}][category]`),
      productName: formData.get(`products[${i}][productName]`),
      productDescription: formData.get(`products[${i}][productDescription]`),
      price: Number(formData.get(`products[${i}][price]`)),
      monthlyFee: Number(formData.get(`products[${i}][monthlyFee]`)),
      startDate: formData.get(`products[${i}][startDate]`) || null,
      endDate: formData.get(`products[${i}][endDate]`) || null,
      dueDate: formData.get(`products[${i}][dueDate]`) || null,
    })
    i++
  }

  // Extract Features
  const features: any[] = []
  let f = 0
  while (formData.has(`features[${f}][feature]`)) {
    features.push({
      feature: formData.get(`features[${f}][feature]`),
      description: formData.get(`features[${f}][description]`),
    })
    f++
  }

  // Icon URL
  const icon = formData.get('icon') as string

  // Upload Gallery
  const gallery: any[] = []
  let g = 0
  // Check if there are gallery items
  while (formData.has(`gallery[${g}][caption]`) || formData.has(`gallery[${g}][image]`)) {
    const imageFile = formData.get(`gallery[${g}][image]`)
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${companyName} Gallery ${g + 1}`,
          },
          file: {
            data: buffer,
            mimetype: imageFile.type,
            name: imageFile.name,
            size: imageFile.size,
          },
        })
        
        gallery.push({
          image: mediaDoc.id,
          caption: formData.get(`gallery[${g}][caption]`) as string,
        })
      } catch (e) {
        console.error(`Error uploading gallery image ${g}:`, e)
      }
    }
    g++
  }

  try {
    console.log(`[createClient] Creating client: ${companyName}`)
    console.log(`[createClient] Gallery items to upload: ${gallery.length}`)
    
    await payload.create({
      collection: 'clients',
      data: {
        companyName,
        ownerName,
        email,
        website,
        type,
        products,
        description,

        features,
        icon,
        gallery: gallery.length > 0 ? gallery : undefined,
        status: status || 'in_progress',
      },
      overrideAccess: true, 
    })
    
    console.log(`[createClient] Successfully created client: ${companyName}`)
  } catch (error) {
    console.error('[createClient] Error creating client:', error)
    console.error('[createClient] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      companyName
    })
    
    if (error instanceof Error && error.message.includes('Payload size')) {
      return { message: 'Upload failed: File size too large. Please reduce image sizes.' }
    }
    
    return { message: `Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }

  revalidatePath('/admin/clients')
  redirect('/admin/clients')
}

export async function updateClient(id: number, prevState: any, formData: FormData): Promise<{ message: string }> {
  const payload = await getPayload({ config })

  const companyName = formData.get('companyName') as string
  const ownerName = formData.get('ownerName') as string
  const email = formData.get('email') as string
  const website = formData.get('website') as string
  const type = formData.get('type') as 'ecommerce' | 'portfolio' | 'business' | 'blog' | 'other'
  const status = formData.get('status') as 'in_progress' | 'completed' | 'in_talks' | 'completed_hide'

  const description = formData.get('description') as string


  // Extract products
  const products: any[] = []
  let i = 0
  while (formData.has(`products[${i}][productName]`)) {
    products.push({
      category: formData.get(`products[${i}][category]`),
      productName: formData.get(`products[${i}][productName]`),
      productDescription: formData.get(`products[${i}][productDescription]`),
      price: Number(formData.get(`products[${i}][price]`)),
      monthlyFee: Number(formData.get(`products[${i}][monthlyFee]`)),
      startDate: formData.get(`products[${i}][startDate]`) || null,
      endDate: formData.get(`products[${i}][endDate]`) || null,
      dueDate: formData.get(`products[${i}][dueDate]`) || null,
    })
    i++
  }

  // Extract Features
  const features: any[] = []
  let f = 0
  while (formData.has(`features[${f}][feature]`)) {
    features.push({
      feature: formData.get(`features[${f}][feature]`),
      description: formData.get(`features[${f}][description]`),
    })
    f++
  }

  // Icon URL
  const icon = formData.get('icon') as string

  // Handle Gallery
  // We need to reconstruct the gallery array. 
  // The form sends `gallery` indices. We loop until we stop finding them.
  // For each index, we check if there's a new file OR an existing ID.
  
  const gallery: any[] = []
  let g = 0
  while (formData.has(`gallery[${g}][caption]`) || formData.has(`gallery[${g}][image]`) || formData.has(`gallery[${g}][existingId]`)) {
    let mediaId: string | number | null = formData.get(`gallery[${g}][existingId]`) as string | null

    const imageFile = formData.get(`gallery[${g}][image]`)
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${companyName} Gallery ${g + 1}`,
          },
          file: {
            data: buffer,
            mimetype: imageFile.type,
            name: imageFile.name,
            size: imageFile.size,
          },
        })
        mediaId = mediaDoc.id
      } catch (e) {
        console.error(`Error uploading gallery image ${g}:`, e)
      }
    }

    if (mediaId) {
        gallery.push({
            image: Number(mediaId),
            caption: formData.get(`gallery[${g}][caption]`) as string,
        })
    }
    
    g++
  }

  try {
    console.log(`[updateClient] Updating client ID: ${id}, Company: ${companyName}`)
    console.log(`[updateClient] Gallery items to upload: ${gallery.length}`)
    
    await payload.update({
      collection: 'clients',
      id,
      data: {
        companyName,
        ownerName,
        email,
        website,
        type,
        status,
        products,
        description,

        features,
        icon,
        gallery: gallery.length > 0 ? gallery : [], // Update gallery (empty array if cleared)
      },
      overrideAccess: true, 
    })
    
    console.log(`[updateClient] Successfully updated client ID: ${id}`)
  } catch (error) {
    console.error('[updateClient] Error updating client:', error)
    console.error('[updateClient] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      clientId: id,
      companyName
    })
    
    if (error instanceof Error && error.message.includes('Payload size')) {
      return { message: 'Upload failed: File size too large. Please reduce image sizes.' }
    }
    
    return { message: `Failed to update client: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }

  revalidatePath('/admin/clients')
  redirect('/admin/clients')
}
