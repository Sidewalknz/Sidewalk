'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

export async function checkHasUsers(): Promise<boolean> {
  const payload = await getPayload({ config })
  const { totalDocs } = await payload.count({
    collection: 'users',
  })
  return totalDocs > 0
}

export async function getUsers(search?: string, sort: string = '-createdAt', role?: string, status?: string) {
    const payload = await getPayload({ config })
    
    const query: any = {
        collection: 'users',
        sort,
    }

    const where: any = {}

    if (search) {
        where.email = { contains: search }
    }

    if (role && role !== 'all') {
        where.role = { equals: role }
    }

    if (status && status !== 'all') {
        // Assuming status logic or field exists, if not this is a placeholder for future extension
        // where.status = { equals: status }
    }

    if (Object.keys(where).length > 0) {
        query.where = where
    }

    const users = await payload.find(query)
    return users.docs
}

export async function getUser(id: string | number) {
    if (!id || id === 'NaN' || id === 'undefined') return null
    const payload = await getPayload({ config })
    const user = await payload.findByID({
        collection: 'users',
        id: typeof id === 'string' ? id : id.toString(),
    })
    return user
}

export async function createUser(prevState: any, formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const role = formData.get('role') as string

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return { message: 'All fields are required.' }
    }

    if (password !== confirmPassword) {
        return { message: 'Passwords do not match.' }
    }

    try {
        await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                firstName,
                lastName,
                phone,
                role: (role || 'user') as any,
                roles: [(role || 'user') as any] // Set both for compatibility
            },
        })
    } catch (error: any) {
        console.error('Error creating user:', error)
        return { message: error.message || 'Failed to create user.' }
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}

export async function updateUser(prevState: any, formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    const id = formData.get('id') as string
    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const role = formData.get('role') as string

    if (!id || !email) {
        return { message: 'ID and Email are required.' }
    }

    const data: any = { email, firstName, lastName, phone, role }

    if (password) {
        if (password !== confirmPassword) {
            return { message: 'Passwords do not match.' }
        }
        data.password = password
    }

    try {
        await payload.update({
            collection: 'users',
            id,
            data: {
                ...data,
                roles: [role as any] // Set both for compatibility
            },
        })
    } catch (error: any) {
        console.error('Error updating user:', error)
        return { message: error.message || 'Failed to update user.' }
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}

export async function deleteUser(id: string | number) {
    const payload = await getPayload({ config })
    
    try {
        await payload.delete({
            collection: 'users',
            id: typeof id === 'string' ? id : id.toString(),
        })
        revalidatePath('/admin/users')
    } catch (error) {
        console.error('Error deleting user:', error)
        throw error
    }
}

export async function logout() {
    (await cookies()).delete('payload-token')
    redirect('/admin/login')
}

export async function updateSelf(formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    const userHeaders = await headers()
    
    // Get current user to ensure we are updating the right record
    const { user } = await payload.auth({ headers: userHeaders })
    if (!user) {
        return { message: 'Unauthorized' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return { message: 'All fields are required.' }
    }

    if (password !== confirmPassword) {
        return { message: 'Passwords do not match.' }
    }

    const data: any = { email, firstName, lastName }

    if (password) {
        data.password = password
    }

    try {
        await payload.update({
            collection: 'users',
            id: user.id,
            data,
        })
    } catch (error: any) {
        console.error('Error updating user:', error)
        return { message: error.message || 'Failed to update account.' }
    }

    revalidatePath('/admin/settings')
    return { message: 'Success' }
}

export async function createFirstUser(prevState: any, formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    // Security: Check if users already exist
    const { totalDocs } = await payload.count({
        collection: 'users',
    })

    if (totalDocs > 0) {
        return { message: 'Setup already completed. Please log in.' }
    }

    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return { message: 'All fields are required.' }
    }

    if (password !== confirmPassword) {
        return { message: 'Passwords do not match.' }
    }

    try {
        await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                firstName,
                lastName,
                role: 'admin' as any,
                roles: ['admin' as any] // Set both for compatibility
            },
        })
    } catch (error: any) {
        console.error('Error creating first user:', error)
        return { message: error.message || 'Failed to create administrative account.' }
    }

    // Redirect to login to allow the user to sign in with their new credentials
    redirect('/admin/login')
}
