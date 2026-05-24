import type { Payload } from "payload"

export const isAdminUser = (user: any): boolean => {
  if (!user) return false
  const roles = user.role || user.roles || []
  return Array.isArray(roles) ? roles.includes("admin") : roles === "admin"
}

export const isStoreOwnerUser = (user: any): boolean => {
  if (!user) return false
  const roles = user.role || user.roles || []
  return Array.isArray(roles) ? roles.includes("store-owner") : roles === "store-owner"
}

export async function getOwnedStoreIds(payload: Payload, user: any): Promise<string[]> {
  if (!user || !user.id) return []
  try {
    const res = await payload.find({
      collection: "stores",
      where: {
        owner: { equals: user.id },
      },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    return res.docs.map((doc: any) => String(doc.id))
  } catch (e) {
    console.error("Error in getOwnedStoreIds:", e)
    return []
  }
}

export async function userOwnsStore(
  payload: Payload,
  user: any,
  storeId?: string | number
): Promise<boolean> {
  if (!user || !storeId) return false
  try {
    const res = await payload.find({
      collection: "stores",
      where: {
        and: [{ id: { equals: storeId } }, { owner: { equals: user.id } }],
      },
      limit: 1,
    })
    return res.docs.length > 0
  } catch (e) {
    return false
  }
}

