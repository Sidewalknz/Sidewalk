'use client'

import React, { useState, useActionState } from 'react'
import { Plus, Trash2, Upload, FileText, Image as ImageIcon } from 'lucide-react'
import { Client, Media } from '@/payload-types'

interface ClientFormProps {
  initialData?: Client
  action: (prevState: any, formData: FormData) => Promise<{ message: string }>
  mode: 'create' | 'edit'
}

const initialState = {
  message: '',
}

export default function ClientForm({ initialData, action, mode }: ClientFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  
  // Initialize state with initialData or defaults
  const [products, setProducts] = useState(initialData?.products?.map((p, i) => ({ ...p, id: i })) || [{ id: 0 }])
  const [features, setFeatures] = useState(initialData?.features?.map((f, i) => ({ ...f, id: i })) || [{ id: 0 }])
  const [gallery, setGallery] = useState(initialData?.gallery?.map((g, i) => ({ ...g, id: i })) || [{ id: 0 }])

  const addProduct = () => {
    setProducts([...products, { id: products.length }])
  }

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = products.filter((_, i) => i !== index)
      setProducts(newProducts)
    }
  }

  const addFeature = () => {
    setFeatures([...features, { id: features.length }])
  }

  const removeFeature = (index: number) => {
      const newFeatures = features.filter((_, i) => i !== index)
      setFeatures(newFeatures)
  }

  const addGalleryItem = () => {
    setGallery([...gallery, { id: gallery.length }])
  }

  const removeGalleryItem = (index: number) => {
      const newGallery = gallery.filter((_, i) => i !== index)
      setGallery(newGallery)
  }

  // Helper to get Media URL or ID (simplification)
  const getMediaUrl = (media: number | Media | undefined | null) => {
      if (media && typeof media === 'object' && 'url' in media) {
          return media.url
      }
      return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{mode === 'create' ? 'Add New Client' : 'Edit Client'}</h2>
      </div>

      <form action={formAction} className="space-y-8" encType="multipart/form-data">
        {state?.message && (
             <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                 {state.message}
             </div>
        )}
        
        {/* Basic Information */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
          <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Company Name</label>
              <input name="companyName" defaultValue={initialData?.companyName} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Owner's Name</label>
              <input name="ownerName" defaultValue={initialData?.ownerName} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email</label>
              <input name="email" type="email" defaultValue={initialData?.email} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Website</label>
              <input name="website" type="url" defaultValue={initialData?.website || ''} placeholder="https://" className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Type</label>
              <select name="type" defaultValue={initialData?.type} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="business">Business</option>
                <option value="ecommerce">Ecommerce</option>
                <option value="portfolio">Portfolio</option>
                <option value="blog">Blog</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Project Details</h3>
            <div className="space-y-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Description</label>
                  <textarea name="description" defaultValue={initialData?.description || ''} rows={3} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>

            </div>

            {/* Features List */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-zinc-300">Features</h4>
                    <button type="button" onClick={addFeature} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium">
                        <Plus className="w-4 h-4" /> Add Feature
                    </button>
                </div>
                {features.map((feature: any, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 relative group">
                        {features.length > 0 && (
                            <button 
                            type="button" 
                            onClick={() => removeFeature(index)}
                            className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <div className="space-y-2">
                             <label className="text-xs font-medium text-zinc-500">Feature Name</label>
                             <input name={`features[${index}][feature]`} defaultValue={feature.feature} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded focus:border-blue-500 outline-none text-sm" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-medium text-zinc-500">Description</label>
                             <textarea name={`features[${index}][description]`} defaultValue={feature.description || ''} rows={1} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded focus:border-blue-500 outline-none text-sm" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Media */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
            <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Media</h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Icon URL</label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <input name="icon" defaultValue={(initialData?.icon as string) || ''} placeholder="/assets/logos/client.svg" className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                        <p className="text-xs text-zinc-500 mt-1">Path to the logo file on the website</p>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-zinc-300">Gallery</h4>
                    <button type="button" onClick={addGalleryItem} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium">
                        <Plus className="w-4 h-4" /> Add Image
                    </button>
                </div>
                {gallery.map((item: any, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 relative group">
                        {gallery.length > 0 && (
                            <button 
                            type="button" 
                            onClick={() => removeGalleryItem(index)}
                            className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                         <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500">Image</label>
                            {item.image && typeof item.image === 'object' && (
                                <div className="mb-2">
                                    <img src={getMediaUrl(item.image) || ''} alt="Gallery Item" className="h-20 w-auto object-cover rounded border border-zinc-800" />
                                </div>
                            )}
                            <input type="file" name={`gallery[${index}][image]`} accept="image/*" className="w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700" />
                            {item.image && (
                                <input type="hidden" name={`gallery[${index}][existingId]`} value={typeof item.image === 'object' ? item.image.id : item.image} />
                            )}
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-medium text-zinc-500">Caption</label>
                             <input name={`gallery[${index}][caption]`} defaultValue={item.caption || ''} placeholder="Image caption..." className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded focus:border-blue-500 outline-none text-sm" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-semibold">Products & Services</h3>
             <button type="button" onClick={addProduct} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium">
               <Plus className="w-4 h-4" /> Add Product
             </button>
          </div>

          {products.map((product: any, index) => (
            <div key={index} className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6 relative group">
              {products.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeProduct(index)}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Category</label>
                  <select name={`products[${index}][category]`} defaultValue={product.category || 'website'} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="website">Website</option>
                    <option value="web-development">Web Development</option>
                    <option value="branding">Branding</option>
                    <option value="logos">Logos</option>
                    <option value="social-media">Social Media</option>
                    <option value="print-design">Print Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Product Name</label>
                  <input name={`products[${index}][productName]`} defaultValue={product.productName} required className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Description</label>
                  <textarea name={`products[${index}][productDescription]`} defaultValue={product.productDescription || ''} rows={2} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Price</label>
                  <input name={`products[${index}][price]`} type="number" step="0.01" defaultValue={product.price || ''} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>

                 <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Monthly Fee</label>
                  <input name={`products[${index}][monthlyFee]`} type="number" step="0.01" defaultValue={product.monthlyFee || ''} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Start Date</label>
                  <input name={`products[${index}][startDate]`} type="date" defaultValue={product.startDate ? product.startDate.split('T')[0] : ''} className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
           {/* Can add back button manually in parent */}
           <button type="submit" className="px-6 py-2 bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 font-medium transition-colors">
              {mode === 'create' ? 'Create Client' : 'Update Client'}
           </button>
        </div>
      </form>
    </div>
  )
}
