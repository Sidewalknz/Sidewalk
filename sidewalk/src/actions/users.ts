'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { User } from '@/payload-types'

export async function checkHasUsers(): Promise<boolean> {
  const payload = await getPayload({ config })
  const { totalDocs } = await payload.count({
    collection: 'users',
  })
  return totalDocs > 0
}

export async function getUsers() {
    const payload = await getPayload({ config })
    const users = await payload.find({
        collection: 'users',
        sort: '-createdAt',
    })
    return users.docs
}

export async function getUser(id: number) {
    const payload = await getPayload({ config })
    const user = await payload.findByID({
        collection: 'users',
        id,
    })
    return user
}

export async function createFirstUser(prevState: any, formData: FormData): Promise<{ message: string }> {
  // ... existing implementation remains the same if needed, or we can unify. 
  // For now keeping it as is to avoid breaking existing flow if used elsewhere.
  const payload = await getPayload({ config })

  // Double check to ensure no users exist to prevent abuse
  const hasUsers = await checkHasUsers()
  if (hasUsers) {
    return { message: 'Users already exist. Cannot create first user.' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password || !confirmPassword) {
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
      },
      overrideAccess: true, // Needed since no user is logged in
    })
  } catch (error) {
    console.error('Error creating first user:', error)
    return { message: 'Failed to create user.' }
  }

  redirect('/login?message=Account created successfully. Please login.')
}

export async function createUser(prevState: any, formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password || !confirmPassword) {
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
            },
        })
    } catch (error) {
        console.error('Error creating user:', error)
        return { message: 'Failed to create user.' }
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}

export async function updateUser(prevState: any, formData: FormData): Promise<{ message: string }> {
    const payload = await getPayload({ config })
    
    const id = formData.get('id') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!id || !email) {
        return { message: 'ID and Email are required.' }
    }

    const data: any = { email }

    // Only update password if provided
    if (password) {
        if (password !== confirmPassword) {
            return { message: 'Passwords do not match.' }
        }
        data.password = password
    }

    try {
        await payload.update({
            collection: 'users',
            id: parseInt(id),
            data,
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return { message: 'Failed to update user.' }
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}

export async function deleteUser(id: number) {
    const payload = await getPayload({ config })
    
    try {
        await payload.delete({
            collection: 'users',
            id,
        })
        revalidatePath('/admin/users')
    } catch (error) {
        console.error('Error deleting user:', error)
        throw error
    }
}
