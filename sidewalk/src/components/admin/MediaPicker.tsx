'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getMedia, createMedia, createMediaBulk } from '@/actions/media'
import { Button } from '@/components/ui/button'
import { ImageIcon, X, Check, Loader2, Search, Plus, FileUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaPickerProps {
    onSelect: (media: any) => void
    onSelectMany?: (media: any[]) => void
    multiple?: boolean
    triggerVariant?: 'default' | 'compact'
    excludeIds?: Array<string | number>
    selectedId?: string | number
    /** Optional selected media object (e.g. relationship populated with `url`) */
    selected?: any
    /** Payload upload collection slug. Defaults to `media`. */
    collection?: string
    label?: string
    showSelection?: boolean
    /** Subtitle text shown in the modal header. Defaults to "Select media from your library" */
    subtitle?: string
    /** Aspect ratio class for the trigger area. Defaults to "aspect-video" */
    aspectRatio?: string
    /** Allowed file accept patterns for upload + drop filtering. Defaults to `image/*`. */
    accept?: string
    /** How to preview the selected item in the trigger. Defaults to `image` (images show thumbnail). */
    selectionPreview?: 'image' | 'filename'
}

function MediaPickerDropTriggerContent({ compact }: { compact: boolean }) {
    return (
        <Plus className={cn('text-brand-600 transition-transform group-hover:scale-110', compact ? 'h-6 w-6' : 'h-8 w-8')} strokeWidth={2.5} />
    )
}

export function MediaPicker({
    onSelect,
    onSelectMany,
    multiple = false,
    triggerVariant = 'default',
    excludeIds = [],
    selectedId,
    selected,
    collection = 'media',
    label,
    showSelection = true,
    subtitle = 'Select media from your library',
    aspectRatio = 'aspect-video',
    accept = 'image/*',
    selectionPreview = 'image',
}: MediaPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
    const [mediaItems, setMediaItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedItem, setSelectedItem] = useState<any>(null)
    
    // Upload state
    const [isDragging, setIsDragging] = useState(false)
    const [uploadFiles, setUploadFiles] = useState<File[]>([])
    const [altText, setAltText] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const excludeIdSet = new Set((excludeIds || []).map((x) => String(x)))

    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            loadMedia()
        }
    }, [isOpen, activeTab, search])

    useEffect(() => {
        // Controlled selection support:
        // - If `selected` is an object, use it for the trigger preview.
        // - If `selected` is explicitly null/undefined, clear the preview.
        if (selected === null || selected === undefined) {
            setSelectedItem(null)
        } else if (typeof selected === 'object') {
            setSelectedItem(selected)
            return
        }

        // If we only have an ID, clear local selection (the trigger will still show "selected" styling),
        // but don't attempt to fetch here.
        if (selectedId !== undefined && selectedId !== null) {
            setSelectedItem(null)
        }
    }, [selected, selectedId])

    const loadMedia = async () => {
        setIsLoading(true)
        try {
            const items = await getMedia(search, collection)
            setMediaItems(items)
        } catch (error) {
            console.error('Failed to load media:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = (item: any) => {
        setSelectedItem(item)
        onSelect(item)
        setIsOpen(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const acceptList = accept.split(',').map((x) => x.trim()).filter(Boolean)
        const files = Array.from(e.dataTransfer.files || []).filter((f) => {
            if (!acceptList.length) return true

            const lowerName = (f.name || '').toLowerCase()
            const ext = lowerName.includes('.') ? `.${lowerName.split('.').pop()}` : ''
            const mime = f.type || ''

            return acceptList.some((pattern) => {
                if (pattern === '*/*') return true
                if (pattern.startsWith('.')) return Boolean(ext) && ext === pattern.toLowerCase()
                if (pattern.endsWith('/*')) return Boolean(mime) && mime.startsWith(pattern.replace('/*', '/'))
                return Boolean(mime) && mime === pattern
            })
        })
        if (!files.length) return

        const picked = multiple ? files : [files[0]]
        setUploadFiles(picked)
        setAltText(picked[0]?.name?.split?.('.')?.[0] || '')
        setActiveTab('upload')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const acceptList = accept.split(',').map((x) => x.trim()).filter(Boolean)
        const files = Array.from(e.target.files || []).filter((f) => {
            if (!acceptList.length) return true

            const lowerName = (f.name || '').toLowerCase()
            const ext = lowerName.includes('.') ? `.${lowerName.split('.').pop()}` : ''
            const mime = f.type || ''

            return acceptList.some((pattern) => {
                if (pattern === '*/*') return true
                if (pattern.startsWith('.')) return Boolean(ext) && ext === pattern.toLowerCase()
                if (pattern.endsWith('/*')) return Boolean(mime) && mime.startsWith(pattern.replace('/*', '/'))
                return Boolean(mime) && mime === pattern
            })
        })
        if (!files.length) return
        const picked = multiple ? files : [files[0]]
        setUploadFiles(picked)
        setAltText(picked[0]?.name?.split?.('.')?.[0] || '')
    }

    const handleUpload = async () => {
        if (!uploadFiles.length) return

        setIsUploading(true)
        try {
            if (multiple && uploadFiles.length > 1) {
                const bulk = new FormData()
                uploadFiles.forEach((f) => bulk.append('files', f))

                const result = await createMediaBulk(bulk)
                if (!result?.success && result?.errors?.length) {
                    const first = result.errors[0]
                    alert(`Upload failed: ${first?.filename ? `${first.filename}: ` : ''}${first.message}`)
                }

                const items = await getMedia()
                const uploaded = uploadFiles
                    .map((f) => items.find((m: any) => m?.filename === f.name) || null)
                    .filter(Boolean) as any[]

                if (uploaded.length) {
                    if (onSelectMany) onSelectMany(uploaded)
                    else uploaded.forEach((m) => onSelect(m))
                }

                setIsOpen(false)
            } else {
                const file = uploadFiles[0]
                const formData = new FormData()
                formData.append('file', file)
                formData.append('alt', altText)
                formData.append('collection', collection)

                const result = await createMedia(formData, collection)
                if (result.message === 'Success') {
                    const items = await getMedia('', collection)
                    if (items.length > 0) {
                        handleSelect(items[0])
                    }
                } else {
                    alert(result.message)
                }
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
            setUploadFiles([])
            setAltText('')
        }
    }

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
            
            <div 
                onClick={() => setIsOpen(true)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    triggerVariant === 'compact'
                        ? 'relative group cursor-pointer h-10 w-10 rounded-full flex items-center justify-center overflow-hidden transition-all'
                        : `relative group cursor-pointer ${aspectRatio} rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 overflow-hidden transition-all`,
                    selectedItem || selectedId 
                        ? "border-brand-500/30 border-solid" 
                        : triggerVariant === 'compact'
                            ? "hover:bg-brand-50 dark:hover:bg-brand-950/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-brand-50/10",
                    isDragging && (triggerVariant === 'compact' ? "bg-brand-50 dark:bg-brand-950/20 scale-105" : "border-brand-500 bg-brand-50/20 scale-105")
                )}
            >
                {selectedItem && showSelection ? (
                    <>
                        {selectionPreview === 'image' && selectedItem?.mimeType?.startsWith?.('image/') ? (
                          <img
                            src={selectedItem.url}
                            alt={selectedItem.alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                            <FileUp className="w-6 h-6" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center px-4 line-clamp-2">
                              {selectedItem?.filename || selectedItem?.alt || 'Selected file'}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</span>
                        </div>
                    </>
                ) : (
                    <MediaPickerDropTriggerContent compact={triggerVariant === 'compact'} />
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    
                    <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Media Assets</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{subtitle}</p>
                                </div>
                                
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('library')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeTab === 'library' ? "bg-white dark:bg-slate-700 text-brand-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        Library
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('upload')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeTab === 'upload' ? "bg-white dark:bg-slate-700 text-brand-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        Upload
                                    </button>
                                </div>
                            </div>
                            <button type="button" onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        {activeTab === 'library' ? (
                            <>
                                <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            placeholder="Search your library..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-12 pl-12 pr-4 rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                                        </div>
                                    ) : mediaItems.filter((m) => !excludeIdSet.has(String(m?.id))).length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {mediaItems
                                                .filter((item) => !excludeIdSet.has(String(item?.id)))
                                                .map((item) => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => handleSelect(item)}
                                                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand-500 transition-all shadow-sm hover:shadow-xl hover:shadow-brand-500/10"
                                                >
                                                    <img 
                                                        src={item.url} 
                                                        alt={item.alt} 
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-brand-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Check className="text-white w-8 h-8" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <ImageIcon className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No assets found</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 p-12 overflow-y-auto">
                                <div className="max-w-xl mx-auto space-y-8">
                                    <div 
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            triggerVariant === 'compact'
                                                ? "relative h-56 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group"
                                                : "relative aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group",
                                            isDragging 
                                                ? "border-brand-500 bg-brand-50/20 scale-[1.02]" 
                                                : "border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden" 
                                            accept={accept}
                                            multiple={multiple}
                                        />
                                        
                                        {uploadFiles.length ? (
                                            <div className="relative w-full h-full p-4 overflow-hidden">
                                                <div className={cn(
                                                    uploadFiles.length > 1 ? 'grid grid-cols-3 gap-3' : 'w-full h-full'
                                                )}>
                                                    {uploadFiles.slice(0, 6).map((f, idx) => (
                                                        <div
                                                            key={`${f.name}-${idx}`}
                                                            className={cn(
                                                                uploadFiles.length > 1 ? 'aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40' : 'w-full h-full'
                                                            )}
                                                        >
                                                            {f.type?.startsWith?.('image/') ? (
                                                                <img
                                                                    src={URL.createObjectURL(f)}
                                                                    className={cn(uploadFiles.length > 1 ? 'w-full h-full object-cover' : 'w-full h-full object-contain rounded-xl')}
                                                                    alt="Preview"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-slate-600 dark:text-slate-300">
                                                                    <FileUp className="w-6 h-6" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-center line-clamp-2">
                                                                        {f.name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setUploadFiles([]); }}
                                                    className="absolute top-6 right-6 p-2 bg-rose-500 text-white rounded-full shadow-lg"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600">
                                                    <FileUp size={32} strokeWidth={2.5} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-black uppercase tracking-tight dark:text-white">Drop your file here</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">or click to browse your files</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {uploadFiles.length === 1 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt Text (SEO)</label>
                                                <input 
                                                    type="text"
                                                    placeholder="Description for accessibility..."
                                                    value={altText}
                                                    onChange={(e) => setAltText(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none h-14 px-6 rounded-2xl text-sm dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all font-bold"
                                                />
                                            </div>

                                            <Button 
                                                type="button"
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus className="w-5 h-5" />
                                                        Upload & Select
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {uploadFiles.length > 1 ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                                Bulk upload uses filenames for alt text. You can edit alt text later in the gallery list.
                                            </div>
                                            <Button 
                                                type="button"
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus className="w-5 h-5" />
                                                        Upload & Add
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
