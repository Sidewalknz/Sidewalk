import React from 'react'
import { getMedia, deleteMedia } from '@/actions/media'
import MediaUploader from '@/components/admin/MediaUploader'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'

export default async function MediaPage() {
    const mediaItems = await getMedia()

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                <MediaUploader />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaItems.map((item) => (
                    <div key={item.id} className="group relative aspect-square bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                        {item.url && (
                            <Image 
                                src={item.url} 
                                alt={item.alt || 'Media item'} 
                                fill 
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        )}
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <form action={async () => {
                                'use server'
                                await deleteMedia(item.id)
                            }}>
                                <button 
                                    type="submit"
                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.alt}
                        </div>
                    </div>
                ))}
                
                {mediaItems.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                        No media found. Upload something to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
