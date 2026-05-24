import { getUser } from '@/actions/users'
import { UserForm } from '@/components/admin/UserForm'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUser(id)

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <UserForm user={user} />
        </div>
    )
}
