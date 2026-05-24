import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import SettingsForm from '@/components/admin/SettingsForm'
import { redirect } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export default async function SettingsPage() {
    const payload = await getPayload({ config })
    const userHeaders = await headers()
    
    const { user } = await payload.auth({ headers: userHeaders })
    
    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <AdminPageHeader
                title="Account Settings"
                subtitle="Manage your administrator profile and security"
            />

            <div className="pt-4">
                <SettingsForm user={user} />
            </div>
        </div>
    )
}
