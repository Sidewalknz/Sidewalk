'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, ExternalLink, Trash2, Check, X, Edit3, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateMediaAlt, deleteMedia } from '@/actions/media'
import MediaToolbar from './MediaToolbar'
import MediaUploader from './MediaUploader'
import { cn } from '@/lib/utils'

export default function MediaGallery({ initialMedia, currentSearch, currentLayout }: any) {
    const [showUploader, setShowUploader] = React.useState(false)

    return (
        <div className="space-y-8">
            <MediaToolbar 
                currentSearch={currentSearch} 
                currentLayout={currentLayout} 
                showUploader={showUploader}
                onToggleUploader={() => setShowUploader(!showUploader)}
            />

            {showUploader && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <MediaUploader />
                </div>
            )}

            {initialMedia.length === 0 ? (
                <EmptyState />
            ) : currentLayout === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {initialMedia.map((item: any) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-[100px,1fr,2fr,auto] gap-4 p-6 border-b border-slate-50 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <span>Preview</span>
                        <span>Name</span>
                        <span>SEO Alt Spec</span>
                        <span className="text-right">Actions</span>
                    </div>
                    {initialMedia.map((item: any) => (
                        <MediaListRow key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    )
}

function MediaCard({ item }: { item: any }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [altText, setAltText] = React.useState(item.alt || '')
    const [isUpdating, setIsUpdating] = React.useState(false)

    const handleUpdate = async () => {
        setIsUpdating(true)
        try {
            await updateMediaAlt(item.id, altText)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Card className="group border-none shadow-xl shadow-slate-200/20 dark:shadow-none rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-100 dark:hover:shadow-brand-900/20">
            <CardContent className="p-0 aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                {item.mimeType?.startsWith('image/') ? (
                    <Image 
                        src={item.url} 
                        alt={item.alt || item.filename} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 group-hover:text-brand-400 transition-colors" />
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.mimeType?.split('/')[1] || 'FILE'}</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </CardContent>
            
            <CardFooter className="p-5 flex flex-col items-start gap-4">
                <div className="w-full">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate italic mb-1">{item.filename}</p>
                    
                    {isEditing ? (
                        <div className="flex gap-2 w-full animate-in slide-in-from-bottom-2">
                            <input 
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-500/20"
                                autoFocus
                            />
                            <button onClick={handleUpdate} disabled={isUpdating} className="text-emerald-500 hover:scale-110 active:scale-95 transition-transform">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setIsEditing(false); setAltText(item.alt || ''); }} className="text-slate-400 hover:scale-110 active:scale-95 transition-transform">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full group/alt">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1">{item.alt || 'No alt spec'}</p>
                            <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-brand-600">
                                <Edit3 className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2 w-full pt-4 border-t border-slate-50 dark:border-slate-800">
                    <Link href={item.url} target="_blank" className="flex-1">
                        <Button variant="ghost" className="w-full justify-start h-8 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/20">
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Original
                        </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this asset?')) {
                                await deleteMedia(item.id)
                            }
                        }}
                        className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-900/20"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

function MediaListRow({ item }: { item: any }) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [altText, setAltText] = React.useState(item.alt || '')
    const [isUpdating, setIsUpdating] = React.useState(false)

    const handleUpdate = async () => {
        setIsUpdating(true)
        try {
            await updateMediaAlt(item.id, altText)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="grid grid-cols-[100px,1fr,2fr,auto] gap-4 p-6 items-center border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
                {item.mimeType?.startsWith('image/') ? (
                    <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    </div>
                )}
            </div>
            
            <div>
                <p className="text-sm font-black text-slate-900 dark:text-white italic line-clamp-1">{item.filename}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{(item.filesize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <div className="max-w-md">
                {isEditing ? (
                    <div className="flex gap-2 animate-in slide-in-from-left-2 items-center">
                        <input 
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-4 focus:ring-brand-50/50 transition-all outline-none"
                            autoFocus
                        />
                        <button onClick={handleUpdate} disabled={isUpdating} className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all">
                            <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setIsEditing(false); setAltText(item.alt || ''); }} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-xl hover:scale-105 active:scale-95 transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 group/alt">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.alt || <span className="italic text-slate-300 dark:text-slate-600">No alt specified</span>}</p>
                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white dark:hover:bg-slate-800 border hover:border-slate-100 dark:hover:border-slate-700 rounded-xl transition-all shadow-sm text-slate-400 hover:text-brand-600">
                            <Edit3 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                 <Link href={item.url} target="_blank">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-400 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 border border-transparent transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </Link>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={async () => {
                        if (confirm('Are you sure you want to delete this asset?')) {
                            await deleteMedia(item.id)
                        }
                    }}
                    className="h-10 w-10 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700 border border-transparent transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Media Gallery Empty</h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">No assets found in the media gallery</p>
        </div>
    )
}
