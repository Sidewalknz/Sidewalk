import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import SocialMediaImageGenerator from '@/components/admin/SocialMediaImageGenerator'

export default async function SocialMediaPage() {
    const payload = await getPayload({ config })
    
    // Fetch all clients for the generator
    const clientsData = await payload.find({
        collection: 'clients',
        limit: 1000,
        sort: 'companyName',
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Social Media Generator</h2>
            </div>

            <SocialMediaImageGenerator clients={clientsData.docs} />
        </div>
    )
}
