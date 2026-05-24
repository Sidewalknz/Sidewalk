'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react'
import { createMedia } from '@/actions/media'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function MediaUploader() {
    const [file, setFile] = useState<File | null>(null)
    const [alt, setAlt] = useState('')
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setAlt(selectedFile.name.split('.')[0])
            setMessage('')
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0]
            setFile(selectedFile)
            setAlt(selectedFile.name.split('.')[0])
            setMessage('')
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', alt)

        try {
            const res = await createMedia(formData)
            if (res.message === 'Success') {
                setFile(null)
                setAlt('')
                if (fileInputRef.current) fileInputRef.current.value = ''
                setMessage('File uploaded successfully!')
            } else {
                setMessage(res.message)
            }
        } catch (err) {
            setMessage('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid md:grid-cols-[1fr,auto,1.5fr] items-center gap-8">
                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        id="media-upload"
                    />
                    <label 
                        htmlFor="media-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "flex flex-col items-center justify-center py-12 px-6 rounded-3xl cursor-pointer transition-all duration-500 group",
                            isDragging 
                                ? "bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-400 scale-[1.02] shadow-xl shadow-brand-100 dark:shadow-brand-900/20" 
                                : file 
                                    ? "bg-emerald-50/30 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800 shadow-sm"
                                    : "bg-slate-50/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-100 dark:hover:shadow-brand-900/20 hover:-translate-y-1"
                        )}
                    >
                        {file ? (
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shadow-inner">
                                    <FileIcon className="w-8 h-8 text-brand-500 dark:text-brand-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px] italic">{file.name}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-brand-600 transition-all duration-500">
                                    <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">Dispatch Resource</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">DRAG & DROP OR EXPLORE</p>
                                </div>
                            </div>
                        )}
                    </label>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="alt-text" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">SEO Alt Specification</Label>
                        <Input 
                            id="alt-text"
                            placeholder="Describe this asset for search engines..."
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            disabled={!file}
                            className="h-12 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-50/50 dark:focus:ring-brand-900/20 transition-all font-medium placeholder:italic placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 justify-end pt-2">
                        {file && (
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    setFile(null);
                                    setAlt('');
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                            >
                                Discard
                            </Button>
                        )}
                        <Button 
                            onClick={handleUpload} 
                            disabled={!file || uploading}
                            className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 text-white rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    UPLOAD ASSET
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {message && (
                <div className={cn(
                    "p-4 rounded-2xl text-center border animate-in zoom-in-95 duration-300",
                    message.includes('successfully') 
                        ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20" 
                        : "bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/20"
                )}>
                    <p className="text-xs font-black uppercase tracking-widest leading-none">{message}</p>
                </div>
            )}
        </div>
    )
}
