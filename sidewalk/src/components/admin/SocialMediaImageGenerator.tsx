'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Client, Media } from '@/payload-types'
import { Download, Layout, Type, Palette, Monitor, RefreshCw, ChevronLeft, ChevronRight, SwatchBook } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAdminTheme, ADMIN_THEMES } from './AdminThemeProvider'

interface Props {
  clients: Client[]
}

type Size = {
  width: number
  height: number
  label: string
  aspect: 'square' | 'story' | 'fb'
}

const SIZES: Size[] = [
  { width: 1080, height: 1080, label: 'Instagram Square (1080x1080)', aspect: 'square' },
  { width: 1080, height: 1920, label: 'Instagram Story (1080x1920)', aspect: 'story' },
  { width: 1200, height: 630, label: 'Facebook / Twitter (1200x630)', aspect: 'fb' },
]

type ContentType = 'home' | 'features' | 'description' | 'products'
type LogoPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type LogoVariant = 'logo.svg' | 'logo1.svg' | 'logo2.svg' | 'logo3.svg' | 'logo-b-r.svg' | 'logo-b-y.svg' | 'logo-w-r.svg' | 'logo-w-y.svg'

export default function SocialMediaImageGenerator({ clients }: Props) {
  const { theme: activeTheme } = useAdminTheme()
  const [selectedClientId, setSelectedClientId] = useState<number | string>(clients[0]?.id || '')
  const [contentType, setContentType] = useState<ContentType>('home')
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('bottom-right')
  const [logoVariant, setLogoVariant] = useState<LogoVariant>('logo.svg')
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('')
  
  // Theme-based initial colors
  const getThemeColors = (themeName: string) => {
    switch (themeName) {
      case 'cream': return { bg: '#FCF5EB', text: '#212C34' }
      case 'red': return { bg: '#CD5037', text: '#FFFFFF' }
      case 'yellow': return { bg: '#E5BF55', text: '#212C34' }
      case 'blue': 
      default: return { bg: '#212C34', text: '#FFFFFF' }
    }
  }

  const initialColors = getThemeColors(activeTheme)
  const [bgColor, setBgColor] = useState(initialColors.bg)
  const [textColor, setTextColor] = useState(initialColors.text)
  const [size, setSize] = useState<Size>(SIZES[0])
  const [featureIndex, setFeatureIndex] = useState(0)
  const [productIndex, setProductIndex] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectedClient = clients.find(c => c.id == selectedClientId)

  // Draw the canvas whenever any option changes
  useEffect(() => {
    drawCanvas()
  }, [selectedClientId, contentType, logoPosition, logoVariant, customLogoUrl, bgColor, textColor, size, featureIndex, productIndex])

  const drawCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedClient) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and set background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load Sidewalk Logo
    const logoImg = new Image()
    await new Promise(resolve => {
        logoImg.onload = resolve
        logoImg.onerror = () => {
            console.error('Failed to load Sidewalk logo', logoVariant)
            resolve(null)
        }
        logoImg.src = `/${logoVariant}`
    })

    // Logo size and margins
    const logoScale = 0.18
    const logoW = canvas.width * logoScale
    const logoH = logoW * 0.5
    const margin = canvas.width * 0.08

    // Draw Content based on type
    if (contentType === 'home') {
        await drawHomeTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'features') {
        drawFeaturesTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'description') {
        drawDescriptionTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'products') {
        drawProductsTemplate(ctx, canvas, logoImg, margin)
    }

    // Draw Sidewalk Logo watermark
    ctx.globalAlpha = 0.8
    
    let logoX = margin
    let logoY = margin

    if (logoPosition.includes('center')) {
      logoX = (canvas.width - logoW) / 2
    } else if (logoPosition.includes('right')) {
      logoX = canvas.width - logoW - margin
    }

    if (logoPosition.includes('bottom')) {
      logoY = canvas.height - logoH - margin
    }

    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH)
    ctx.globalAlpha = 1.0
  }

  const drawHomeTemplate = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement, margin: number) => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const iconSize = canvas.width * 0.3

    // Draw Connector (X)
    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.06}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = 0.5
    ctx.fillText('X', centerX, centerY)
    ctx.globalAlpha = 1.0

    // Draw Sidewalk Logo on left
    const swIconW = iconSize
    const swIconH = swIconW * 0.5
    ctx.drawImage(logoImg, centerX - swIconW - margin/2, centerY - swIconH/2, swIconW, swIconH)

    // Draw Client Logo on right if available
    const iconUrl = customLogoUrl || selectedClient?.icon
    if (iconUrl) {
        const clientLogo = new Image()
        
        // Use anonymous crossOrigin only for potential external URLs
        // BUT if it's an external URL, it might fail to load due to CORS if the server doesn't support it.
        // For the PREVIEW to work, we might need to skip this, but for DOWNLOAD to work, we need it.
        // We'll try to load it WITH anonymous first, and if that fails, we'll try WITHOUT just for preview.
        
        const tryLoad = (useCors: boolean) => new Promise((resolve) => {
            if (useCors) clientLogo.crossOrigin = 'anonymous'
            else clientLogo.removeAttribute('crossOrigin')
            
            clientLogo.onload = () => resolve(true)
            clientLogo.onerror = () => resolve(false)
            clientLogo.src = iconUrl.startsWith('http') || iconUrl.startsWith('/') ? iconUrl : `/${iconUrl}`
        })

        let success = await tryLoad(true)
        if (!success) {
            console.warn('Social Generator: Retrying client logo without CORS for preview', iconUrl)
            success = await tryLoad(false)
        }
        
        if (success && clientLogo.complete && (clientLogo.naturalHeight !== 0 || clientLogo.width !== 0)) {
            const aspect = clientLogo.width / clientLogo.height || 1
            let drawW = iconSize
            let drawH = drawW / aspect
            
            // Constrain height
            if (drawH > iconSize) {
                drawH = iconSize
                drawW = drawH * aspect
            }
            
            ctx.drawImage(clientLogo, centerX + margin/2, centerY - drawH/2, drawW, drawH)
        } else {
            // Fallback if image failed to load
            drawClientNameFallback(ctx, canvas, centerX, centerY, margin)
        }
    } else {
        // Fallback to text
        drawClientNameFallback(ctx, canvas, centerX, centerY, margin)
    }
  }

  const drawClientNameFallback = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, centerX: number, centerY: number, margin: number) => {
    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.05}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    wrapText(ctx, selectedClient?.companyName || '', centerX + margin/2, centerY, canvas.width/2 - margin, canvas.width * 0.06)
  }

  const drawFeaturesTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement, margin: number) => {
    const features = selectedClient?.features || []
    const feature = features[featureIndex]
    const contentY = logoPosition.startsWith('top') ? margin * 3 : margin * 1.5

    if (!feature) {
        ctx.fillStyle = textColor
        ctx.font = `${canvas.width * 0.04}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('No features found', canvas.width/2, canvas.height/2)
        return
    }

    ctx.fillStyle = '#3b82f6' // Sidewalk Blue
    ctx.font = `bold ${canvas.width * 0.04}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('FEATURE', margin, contentY)

    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.09}px sans-serif`
    wrapText(ctx, feature.feature, margin, contentY + margin, canvas.width - margin * 2, canvas.width * 0.11)

    if (feature.description) {
        ctx.font = `${canvas.width * 0.05}px sans-serif`
        ctx.globalAlpha = 0.7
        wrapText(ctx, feature.description, margin, contentY + margin * 3, canvas.width - margin * 2, canvas.width * 0.07)
        ctx.globalAlpha = 1.0
    }
  }

  const drawDescriptionTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement, margin: number) => {
    const description = selectedClient?.description
    const contentY = logoPosition.startsWith('top') ? margin * 3 : margin * 2

    if (!description) {
        ctx.fillStyle = textColor
        ctx.font = `${canvas.width * 0.04}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('No description found', canvas.width/2, canvas.height/2)
        return
    }

    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.06}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    wrapText(ctx, description, margin, contentY, canvas.width - margin * 2, canvas.width * 0.09)
  }

  const drawProductsTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement, margin: number) => {
    const products = selectedClient?.products || []
    const product = products[productIndex]
    const contentY = logoPosition.startsWith('top') ? margin * 3 : margin * 1.5

    if (!product) {
        ctx.fillStyle = textColor
        ctx.font = `${canvas.width * 0.04}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('No products found', canvas.width/2, canvas.height/2)
        return
    }

    ctx.fillStyle = '#3b82f6'
    ctx.font = `bold ${canvas.width * 0.04}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(product.category?.toUpperCase() || 'PRODUCT', margin, contentY)

    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.09}px sans-serif`
    wrapText(ctx, product.productName, margin, contentY + margin, canvas.width - margin * 2, canvas.width * 0.11)

    if (product.productDescription) {
        ctx.font = `${canvas.width * 0.05}px sans-serif`
        ctx.globalAlpha = 0.7
        wrapText(ctx, product.productDescription, margin, contentY + margin * 3, canvas.width - margin * 2, canvas.width * 0.07)
        ctx.globalAlpha = 1.0
    }
  }

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ')
    let line = ''
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y)
        line = words[n] + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, y)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    try {
        const link = document.createElement('a')
        link.download = `sidewalk-social-${selectedClient?.companyName || 'export'}-${contentType}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    } catch (err) {
        console.error('Download failed:', err)
        alert('Download blocked by browser security (CORS). This happens when using an external Client Logo URL that doesn\'t allow cross-origin access. To fix this, upload the logo to your media collection or use an image from a CORS-friendly host.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6 space-y-6" style={{ backgroundColor: 'var(--admin-sidebar-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <Layout className="w-4 h-4" /> Client
            </label>
            <select 
              className="w-full transition-colors outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value)
                setFeatureIndex(0)
                setProductIndex(0)
              }}
            >
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.companyName}</option>
              ))}
            </select>
          </div>

          {/* Custom Logo Override */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
               Custom Client Logo URL
            </label>
            <input 
              type="text"
              placeholder="https://... or /assets/..."
              className="w-full transition-colors outline-none focus:ring-1 focus:ring-blue-500 text-xs py-2 px-3 rounded-lg border"
              style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}
              value={customLogoUrl}
              onChange={(e) => setCustomLogoUrl(e.target.value)}
            />
            {customLogoUrl && (
              <button 
                onClick={() => setCustomLogoUrl('')}
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: 'var(--admin-accent)' }}
              >
                Clear Override
              </button>
            )}
          </div>

          {/* Content Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <Type className="w-4 h-4" /> Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['home', 'features', 'description', 'products'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ 
                    backgroundColor: contentType === type ? 'var(--admin-accent)' : 'var(--admin-bg)',
                    color: contentType === type ? 'var(--admin-accent-text)' : 'var(--admin-text)',
                    border: '1px solid var(--admin-sidebar-border)',
                    boxShadow: contentType === type ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              Logo Variant
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                'logo.svg', 'logo1.svg', 'logo2.svg', 'logo3.svg',
                'logo-b-r.svg', 'logo-b-y.svg', 'logo-w-r.svg', 'logo-w-y.svg'
              ].map((v) => (
                <button
                  key={v}
                  onClick={() => setLogoVariant(v as LogoVariant)}
                  className="p-1.5 rounded-lg border-2 transition-all aspect-square flex items-center justify-center overflow-hidden hover:scale-105"
                  style={{ 
                    borderColor: logoVariant === v ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                    backgroundColor: v.includes('-w-') ? '#212C34' : '#FCF5EB', // Contrast background for white/black logos
                  }}
                  title={v}
                >
                  <img src={`/${v}`} alt={v} className="max-w-full max-h-full object-contain pointer-events-none" />
                </button>
              ))}
            </div>
          </div>

          {/* Logo Position */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Sidewalk Logo Position</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                'top-left', 'top-center', 'top-right',
                'bottom-left', 'bottom-center', 'bottom-right'
              ] as LogoPosition[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setLogoPosition(pos)}
                  className="px-2 py-1.5 rounded text-[10px] font-medium border uppercase transition-all"
                  style={{ 
                    borderColor: logoPosition === pos ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                    backgroundColor: logoPosition === pos ? 'rgba(var(--admin-accent), 0.1)' : 'var(--admin-bg)',
                    color: logoPosition === pos ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                  }}
                >
                  {pos.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <SwatchBook className="w-4 h-4" /> Theme Presets
            </label>
            <div className="flex gap-2">
              {Object.values(ADMIN_THEMES).map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    const colors = getThemeColors(t.name)
                    setBgColor(colors.bg)
                    setTextColor(colors.text)
                  }}
                  title={`Preset: ${t.label}`}
                  className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110"
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>

          {contentType === 'features' && (selectedClient?.features?.length || 0) > 1 && (
            <div className="space-y-2">
               <label className="text-sm font-medium flex items-center justify-between" style={{ color: 'var(--admin-text-muted)' }}>
                <span>Select Feature</span>
                <span>{featureIndex + 1} / {selectedClient?.features?.length}</span>
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFeatureIndex(prev => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-sidebar-border)' }}
                  disabled={featureIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 border rounded-lg px-3 py-2 text-sm truncate" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}>
                    {selectedClient?.features?.[featureIndex]?.feature}
                </div>
                <button 
                  onClick={() => setFeatureIndex(prev => Math.min((selectedClient?.features?.length || 1) - 1, prev + 1))}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-sidebar-border)' }}
                  disabled={featureIndex === (selectedClient?.features?.length || 1) - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {contentType === 'products' && (selectedClient?.products?.length || 0) > 1 && (
            <div className="space-y-2">
               <label className="text-sm font-medium flex items-center justify-between" style={{ color: 'var(--admin-text-muted)' }}>
                <span>Select Product</span>
                <span>{productIndex + 1} / {selectedClient?.products?.length}</span>
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setProductIndex(prev => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-sidebar-border)' }}
                  disabled={productIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 border rounded-lg px-3 py-2 text-sm truncate" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}>
                    {selectedClient?.products?.[productIndex]?.productName}
                </div>
                <button 
                  onClick={() => setProductIndex(prev => Math.min((selectedClient?.products?.length || 1) - 1, prev + 1))}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-sidebar-border)' }}
                  disabled={productIndex === (selectedClient?.products?.length || 1) - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <Monitor className="w-4 h-4" /> Image Size
            </label>
            <select 
              className="w-full transition-colors outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}
              value={SIZES.indexOf(size)}
              onChange={(e) => setSize(SIZES[parseInt(e.target.value)])}
            >
              {SIZES.map((s, i) => (
                <option key={i} value={i}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                <Palette className="w-4 h-4" /> Background
              </label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                />
                <input 
                  type="text" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 border rounded-lg px-2 text-xs uppercase"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                <Palette className="w-4 h-4" /> Text
              </label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                />
                <input 
                  type="text" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 border rounded-lg px-2 text-xs uppercase"
                  style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', borderColor: 'var(--admin-sidebar-border)' }}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={downloadImage}
            className="w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              backgroundColor: 'var(--admin-accent)', 
              color: 'var(--admin-accent-text)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Download className="w-5 h-5" /> Download Image
          </button>
        </Card>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <div className="w-full rounded-xl p-8 border flex items-center justify-center overflow-auto min-h-[600px] shadow-inner"
             style={{ backgroundColor: 'var(--admin-bg)', borderColor: 'var(--admin-sidebar-border)' }}>
           <div className="relative shadow-2xl">
                <canvas
                    ref={canvasRef}
                    width={size.width}
                    height={size.height}
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '70vh', 
                        height: 'auto',
                        width: size.aspect === 'square' ? '500px' : size.aspect === 'story' ? '300px' : '600px'
                    }}
                    className="rounded shadow-lg bg-black"
                />
                
                <div className="absolute top-4 right-4 group">
                    <button 
                        onClick={drawCanvas}
                        className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all group-hover:rotate-180"
                        title="Redraw Preview"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
           </div>
        </div>
      </div>
    </div>
  )
}
