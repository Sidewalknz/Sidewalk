type PayloadRequestLike = {
  payload: {
    find: (args: any) => Promise<{ docs?: any[] }>
    update: (args: any) => Promise<any>
  }
}

function relationId(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return String((value as any).id ?? '')
  return String(value)
}

function removeArrayRowsByRelation(rows: unknown, fieldName: string, deletedId: string) {
  if (!Array.isArray(rows)) return rows
  return rows.filter((row) => relationId((row as any)?.[fieldName]) !== deletedId)
}

async function findAll(req: PayloadRequestLike, collection: string, where: any) {
  const docs: any[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    let result: { docs?: any[]; hasNextPage?: boolean }
    try {
      result = await req.payload.find({
        collection,
        where,
        page,
        limit: 100,
        depth: 0,
        req,
      })
    } catch {
      return docs
    }

    docs.push(...(result.docs || []))
    hasNextPage = Boolean((result as any).hasNextPage)
    page += 1
  }

  return docs
}

async function updateDocs(req: PayloadRequestLike, collection: string, docs: any[], getData: (doc: any) => any) {
  await Promise.all(
    docs.map(async (doc) => {
      try {
        await req.payload.update({
          collection,
          id: doc.id,
          data: getData(doc),
          req,
        })
      } catch {
        // Optional module collections may disappear or reject updates; media deletion should continue.
      }
    }),
  )
}

export async function cleanupDeletedMediaReferences(req: PayloadRequestLike, deletedMediaId: string | number) {
  const id = String(deletedMediaId)

  const [merch, schools, socialItems, testimonials, tourTemplates] = await Promise.all([
    findAll(req, 'merch', { image: { equals: id } }),
    findAll(req, 'schools', { logo: { equals: id } }),
    findAll(req, 'social-wall-items', {
      or: [{ media: { equals: id } }, { thumbnail: { equals: id } }],
    }),
    findAll(req, 'testimonials', { image: { equals: id } }),
    findAll(req, 'tour-templates', {
      or: [{ 'images.image': { equals: id } }, { 'informationBooklets.file': { equals: id } }],
    }),
  ])

  await Promise.all([
    updateDocs(req, 'merch', merch, () => ({ image: null })),
    updateDocs(req, 'schools', schools, () => ({ logo: null })),
    updateDocs(req, 'social-wall-items', socialItems, (doc) => ({
      ...(relationId(doc.media) === id ? { media: null } : null),
      ...(relationId(doc.thumbnail) === id ? { thumbnail: null } : null),
    })),
    updateDocs(req, 'testimonials', testimonials, () => ({ image: null })),
    updateDocs(req, 'tour-templates', tourTemplates, (doc) => ({
      images: removeArrayRowsByRelation(doc.images, 'image', id),
      informationBooklets: removeArrayRowsByRelation(doc.informationBooklets, 'file', id),
    })),
  ])
}

export async function cleanupDeletedDownloadFileReferences(req: PayloadRequestLike, deletedFileId: string | number) {
  const id = String(deletedFileId)
  const downloads = await findAll(req, 'downloads', { file: { equals: id } })

  await updateDocs(req, 'downloads', downloads, () => ({ file: null }))
}
