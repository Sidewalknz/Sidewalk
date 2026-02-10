'use client'

import React, { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { createMedia } from '@/actions/media'
import { useRouter } from 'next/navigation'

export default function MediaUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        
        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const result = await createMedia(formData)
            
            if (result.message !== 'Success') {
                alert(result.message) // Simple error handling for now
            } else {
                router.refresh()
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-white text-zinc-950 rounded hover:bg-zinc-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        Upload New
                    </>
                )}
            </button>
        </div>
    )
}
