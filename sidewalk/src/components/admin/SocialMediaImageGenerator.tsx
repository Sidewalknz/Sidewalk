'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Client, Media } from '@/payload-types'
import { Download, Layout, Type, Palette, Monitor, RefreshCw, ChevronLeft, ChevronRight, SwatchBook, Image as ImageIcon, Upload } from 'lucide-react'
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
  { width: 1200, height: 630, label: 'Facebook (1200x630)', aspect: 'fb' },
]

const SIDEWALK_LOGO_LIGHT_PRESETS = [
  { name: 'Standard', colors: { '#CD5037': '#CD5037', '#E5BF55': '#E5BF55', '#FCF5EB': '#FCF5EB' } },
  { name: 'Light Red', colors: { '#CD5037': '#CD5037', '#E5BF55': '#212C34', '#FCF5EB': '#FCF5EB' } },
  { name: 'Light Yellow', colors: { '#CD5037': '#212C34', '#E5BF55': '#E5BF55', '#FCF5EB': '#FCF5EB' } },
]

const SIDEWALK_LOGO_DARK_PRESETS = [
  { name: 'Standard Dark', colors: { '#CD5037': '#CD5037', '#E5BF55': '#E5BF55', '#FCF5EB': '#212C34' } },
  { name: 'Dark Red', colors: { '#CD5037': '#CD5037', '#E5BF55': '#FCF5EB', '#FCF5EB': '#212C34' } },
  { name: 'Dark Yellow', colors: { '#CD5037': '#FCF5EB', '#E5BF55': '#E5BF55', '#FCF5EB': '#212C34' } },
]

type ContentType = 'home' | 'features' | 'description'
type LogoPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
type SidewalkLogoStyle = 'logo.svg' | 'logo2.svg' | 'none'

export default function SocialMediaImageGenerator({ clients }: Props) {
  const { theme: activeTheme } = useAdminTheme()
  const [selectedClientId, setSelectedClientId] = useState<number | string>(clients[0]?.id || '')
  const [contentType, setContentType] = useState<ContentType>('home')
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('bottom-right')
  const [logoVariant, setLogoVariant] = useState<SidewalkLogoStyle>('logo.svg')
  const [homeLogoVariant, setHomeLogoVariant] = useState<SidewalkLogoStyle>('logo.svg')
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('')
  const [homeVariation, setHomeVariation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [editableFeatures, setEditableFeatures] = useState<{ title: string, description: string }[]>([])
  const [editableDescription, setEditableDescription] = useState('')
  
  // Theme-based initial colors
  const getThemeColors = (themeName: string) => {
    switch (themeName) {
      case 'cream': return { bg: '#FCF5EB', text: '#212C34' }
      case 'red': return { bg: '#CD5037', text: '#FCF5EB' }
      case 'yellow': return { bg: '#E5BF55', text: '#212C34' }
      case 'blue': 
      default: return { bg: '#212C34', text: '#FCF5EB' }
    }
  }

  const initialColors = getThemeColors(activeTheme)
  const [bgColor, setBgColor] = useState(initialColors.bg)
  const [textColor, setTextColor] = useState(initialColors.text)
  const [highlightColor, setHighlightColor] = useState('#CD5037') // Default to Red
  const [customBgUrl, setCustomBgUrl] = useState<string>('')
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(0.4)
  const [size, setSize] = useState<Size>(SIZES[0])
  const [bgZoom, setBgZoom] = useState(1.0)
  const [featureIndex, setFeatureIndex] = useState(0)
  const [svgOriginalContent, setSvgOriginalContent] = useState<string>('')
  const [svgColors, setSvgColors] = useState<string[]>([])
  const [svgColorMap, setSvgColorMap] = useState<Record<string, string>>({})
  const [sidewalkLogoColorMap, setSidewalkLogoColorMap] = useState<Record<string, string>>({
    '#CD5037': '#CD5037', // Red
    '#E5BF55': '#E5BF55', // Yellow
    '#FCF5EB': '#FCF5EB'  // Cream
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectedClient = clients.find(c => c.id == selectedClientId)

  // Fetch and parse SVG colors
  useEffect(() => {
    const fetchSvg = async () => {
      const iconUrl = customLogoUrl || selectedClient?.icon
      if (!iconUrl || !iconUrl.toLowerCase().endsWith('.svg')) {
        setSvgOriginalContent('')
        setSvgColors([])
        setSvgColorMap({})
        return
      }

      try {
        const response = await fetch(getProxiedUrl(iconUrl))
        if (!response.ok) return
        const svgText = await response.text()
        setSvgOriginalContent(svgText)

        // Extract colors
        const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
        const foundColors = svgText.match(colorRegex) || []
        const uniqueColors = Array.from(new Set(foundColors.map(c => c.toUpperCase())))
        setSvgColors(uniqueColors)
        
        // Reset color map
        const newMap: Record<string, string> = {}
        uniqueColors.forEach(c => newMap[c] = c)
        setSvgColorMap(newMap)
      } catch (err) {
        console.error('Error fetching SVG:', err)
      }
    }

    fetchSvg()
  }, [selectedClientId, customLogoUrl, selectedClient?.icon])

  // Draw the canvas whenever any option changes
  useEffect(() => {
    drawCanvas()
  }, [selectedClientId, contentType, logoPosition, logoVariant, homeLogoVariant, customLogoUrl, customBgUrl, bgOverlayOpacity, bgZoom, homeVariation, bgColor, textColor, highlightColor, svgColorMap, sidewalkLogoColorMap, size, featureIndex, editableFeatures, editableDescription])

  // Update editable text when content selection changes
  useEffect(() => {
    if (selectedClient) {
      if (contentType === 'features') {
        const features = (selectedClient.features || []).map(f => ({
          title: f.feature || '',
          description: f.description || ''
        }))
        setEditableFeatures(features)
      } else if (contentType === 'description') {
        setEditableDescription(selectedClient.description || '')
      } else {
        setEditableFeatures([])
        setEditableDescription('')
      }
    }
  }, [selectedClientId, contentType])

  const getProxiedUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('data:')) return url
    if (url.startsWith('http')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`
    }
    return url
  }

  const drawCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedClient) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Custom Background Image
    if (customBgUrl) {
        const bgImg = new Image()
        bgImg.crossOrigin = 'anonymous'
        await new Promise(resolve => {
            bgImg.onload = resolve
            bgImg.onerror = () => resolve(null)
            bgImg.src = getProxiedUrl(customBgUrl)
        })
        
        if (bgImg.complete && bgImg.width > 0) {
            // Draw (object-fit: cover)
            const canvasRatio = canvas.width / canvas.height
            const imgRatio = bgImg.width / bgImg.height
            let drawW, drawH, drawX, drawY
            
            if (imgRatio > canvasRatio) {
                drawH = canvas.height * bgZoom
                drawW = drawH * imgRatio
            } else {
                drawW = canvas.width * bgZoom
                drawH = drawW / imgRatio
            }
            
            drawX = (canvas.width - drawW) / 2
            drawY = (canvas.height - drawH) / 2
            
            ctx.drawImage(bgImg, drawX, drawY, drawW, drawH)
            
            // Apply Overlay
            if (bgOverlayOpacity > 0) {
                ctx.fillStyle = `rgba(0,0,0,${bgOverlayOpacity})`
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        }
    }

    // Load Sidewalk Logo Watermark
    const logoImg = logoVariant !== 'none' ? await loadSidewalkLogo(logoVariant) : null

    // Logo size and margins
    const logoScale = 0.18
    const logoW = canvas.width * logoScale
    const logoH = logoW * 0.5
    const margin = canvas.width * 0.08

    // Draw Content based on type
    if (contentType === 'home') {
        await drawHomeTemplate(ctx, canvas, margin)
    } else if (contentType === 'features') {
        drawFeaturesTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'description') {
        drawDescriptionTemplate(ctx, canvas, logoImg, margin)
    }

    // Draw Sidewalk Logo watermark
    if (logoImg && logoImg.complete && logoImg.width > 0) {
        ctx.globalAlpha = 1.0
        
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
  }

  const loadClientLogo = async (iconUrl: string): Promise<HTMLImageElement | null> => {
    if (!iconUrl) return null

    const logo = new Image()
    logo.crossOrigin = 'anonymous'

    return new Promise<HTMLImageElement | null>((resolve) => {
      logo.onload = () => resolve(logo)
      logo.onerror = () => {
        console.error('Failed to load client logo', iconUrl)
        resolve(null)
      }

      const isSvg = iconUrl.toLowerCase().endsWith('.svg')
      if (isSvg && svgOriginalContent) {
        // Use recolored SVG
        // Use recolored SVG with single-pass replacement
        let newSvg = svgOriginalContent
        const lowerColorMap = Object.entries(svgColorMap).reduce((acc, [k, v]) => {
          acc[k.toLowerCase()] = v
          return acc
        }, {} as Record<string, string>)
        
        newSvg = newSvg.replace(/#[0-9a-fA-F]{6}/gi, (match) => {
          return lowerColorMap[match.toLowerCase()] || match
        })
        const blob = new Blob([newSvg], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        logo.src = url
      } else {
        logo.src = getProxiedUrl(iconUrl)
      }
    })
  }

  const loadSidewalkLogo = async (style: SidewalkLogoStyle): Promise<HTMLImageElement | null> => {
    if (style === 'none') return null

    const logo = new Image()
    logo.crossOrigin = 'anonymous'

    try {
      const response = await fetch(`/${style}`)
      if (!response.ok) return null
      let svgText = await response.text()

      // Apply recoloring with single-pass replacement to avoid collisions
      const lowerColorMap = Object.entries(sidewalkLogoColorMap).reduce((acc, [k, v]) => {
        acc[k.toLowerCase()] = v
        return acc
      }, {} as Record<string, string>)

      svgText = svgText.replace(/#[0-9a-fA-F]{6}/gi, (match) => {
        return lowerColorMap[match.toLowerCase()] || match
      })

      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      return new Promise<HTMLImageElement | null>((resolve) => {
        logo.onload = () => resolve(logo)
        logo.onerror = () => resolve(null)
        logo.src = url
      })
    } catch (err) {
      console.error('Error loading Sidewalk logo:', err)
      return null
    }
  }

  const drawHomeTemplate = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, margin: number) => {
    // Load Home Template Logo
    const homeLogoImg = await loadSidewalkLogo(homeLogoVariant)
    const homeLogoLoaded = !!homeLogoImg

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const iconSize = canvas.width * 0.3

    // Draw Connector (X)
    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.06}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = 0.5
    
    if (homeVariation === 'horizontal') {
        ctx.fillText('x', centerX, centerY)
    } else {
        ctx.fillText('x', centerX, centerY)
    }
    ctx.globalAlpha = 1.0

    // Load Client Logo URL
    const iconUrl = customLogoUrl || selectedClient?.icon
    const clientLogo = iconUrl ? await loadClientLogo(iconUrl) : null
    const logoLoaded = !!clientLogo

    const swLogoAspect = 0.5
    const gap = canvas.width * 0.08
    const swIconW = iconSize * 1.1
    const swIconH = swIconW * swLogoAspect

    if (homeVariation === 'horizontal') {
        // Draw Sidewalk Logo (Left)
        if (homeLogoLoaded) {
            ctx.drawImage(homeLogoImg, centerX - swIconW - gap, centerY - swIconH/2, swIconW, swIconH)
        }

        if (logoLoaded && clientLogo && clientLogo.complete) {
            const aspect = clientLogo.width / clientLogo.height || 1
            let drawW = iconSize * 1.1
            let drawH = drawW / aspect
            
            // Constrain if too tall
            if (drawH > swIconW * 0.8) {
                drawH = swIconW * 0.8
                drawW = drawH * aspect
            }
            ctx.drawImage(clientLogo, centerX + gap, centerY - drawH/2, drawW, drawH)
        } else {
            drawClientNameFallback(ctx, canvas, centerX + gap, centerY, margin, 'left')
        }
    } else {
        // Vertical Layout - Improved spacing and sizing
        const verticalGap = canvas.height * 0.09
        
        // Draw Sidewalk Logo (Top)
        if (homeLogoLoaded) {
            ctx.drawImage(homeLogoImg, centerX - swIconW/2, centerY - verticalGap - swIconH, swIconW, swIconH)
        }

        // Draw Client Logo (Bottom)
        if (logoLoaded && clientLogo && clientLogo.complete) {
            const aspect = clientLogo.width / clientLogo.height || 1
            let drawW = swIconW
            let drawH = drawW / aspect
            
            // Constrain if too tall
            if (drawH > swIconW * 0.8) {
                drawH = swIconW * 0.8
                drawW = drawH * aspect
            }
            
            ctx.drawImage(clientLogo, centerX - drawW/2, centerY + verticalGap, drawW, drawH)
        } else {
            drawClientNameFallback(ctx, canvas, centerX, centerY + verticalGap + swIconH/2, margin, 'center')
        }
    }
  }

  const drawClientNameFallback = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, x: number, y: number, margin: number, align: CanvasTextAlign = 'left') => {
    ctx.fillStyle = textColor
    ctx.font = `bold ${canvas.width * 0.05}px sans-serif`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    const maxWidth = align === 'center' ? canvas.width - margin * 2 : canvas.width/2 - margin
    wrapText(ctx, (selectedClient?.companyName || '').toLowerCase(), x, y, maxWidth, canvas.width * 0.06, true, highlightColor)
  }

  const drawFeaturesTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement | null, margin: number) => {
    const contentY = logoPosition.startsWith('top') ? margin * 3 : margin * 1.5

    if (editableFeatures.length === 0) {
        ctx.fillStyle = textColor
        ctx.font = `${canvas.width * 0.04}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('No features found', canvas.width/2, canvas.height/2)
        return
    }

    // Determine max available height
    let maxContentHeight = canvas.height - contentY - margin
    if (logoPosition.startsWith('bottom')) {
        maxContentHeight -= margin * 1.5
    }

    let titleFontSize = canvas.width * 0.06
    let descFontSize = canvas.width * 0.035
    let scaleFactor = 1.0

    // Scaling loop
    while (scaleFactor > 0.5) {
        let testY = 0
        const currentTitleSize = titleFontSize * scaleFactor
        const currentDescSize = descFontSize * scaleFactor
        const currentTitleLH = currentTitleSize * 1.2
        const currentDescLH = currentDescSize * 1.3

        editableFeatures.forEach((feature) => {
            ctx.font = `bold ${currentTitleSize}px sans-serif`
            testY += wrapText(ctx, feature.title.toLowerCase(), margin, 0, canvas.width - margin * 2, currentTitleLH, false)
            
            if (feature.description) {
                ctx.font = `${currentDescSize}px sans-serif`
                testY += wrapText(ctx, feature.description.toLowerCase(), margin, 0, canvas.width - margin * 2, currentDescLH, false)
                testY += margin * 0.3 * scaleFactor
            } else {
                testY += margin * 0.3 * scaleFactor
            }
        })

        if (testY <= maxContentHeight) break
        scaleFactor -= 0.05
    }

    const currentTitleSize = titleFontSize * scaleFactor
    const currentDescSize = descFontSize * scaleFactor
    const currentTitleLH = currentTitleSize * 1.2
    const currentDescLH = currentDescSize * 1.3

    ctx.font = `bold ${canvas.width * 0.04}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.6
    ctx.fillText('features', margin, contentY)
    ctx.globalAlpha = 1.0

    let currentY = contentY + margin

    editableFeatures.forEach((feature) => {
        // Title
        ctx.fillStyle = textColor
        ctx.font = `bold ${currentTitleSize}px sans-serif`
        const titleHeight = wrapText(ctx, feature.title.toLowerCase(), margin, currentY, canvas.width - margin * 2, currentTitleLH, true, highlightColor)
        
        currentY += titleHeight

        // Description
        if (feature.description) {
            ctx.font = `${currentDescSize}px sans-serif`
            ctx.globalAlpha = 0.7
            const descHeight = wrapText(ctx, feature.description.toLowerCase(), margin, currentY, canvas.width - margin * 2, currentDescLH, true, highlightColor)
            ctx.globalAlpha = 1.0
            currentY += descHeight + margin * 0.3 * scaleFactor
        } else {
            currentY += margin * 0.3 * scaleFactor
        }
    })
  }

  const drawDescriptionTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement | null, margin: number) => {
    const description = editableDescription || selectedClient?.description || ''
    const availableWidth = canvas.width - margin * 2
    
    // Determine target area based on logo position
    // We want to avoid the logo if it's in the bottom
    let maxContentHeight = canvas.height - margin * 2
    if (logoPosition.startsWith('bottom')) {
        maxContentHeight -= margin * 1.5 // Leave extra space for the logo
    }
    
    let fontSize = canvas.width * 0.08 // Start with a larger font
    let lineHeight = fontSize * 1.3
    
    // Scaling loop
    while (fontSize > canvas.width * 0.03) {
        ctx.font = `bold ${fontSize}px sans-serif`
        const totalHeight = wrapText(ctx, description.toLowerCase(), margin, 0, availableWidth, lineHeight, false, highlightColor)
        if (totalHeight <= maxContentHeight) break
        fontSize -= 2
        lineHeight = fontSize * 1.3
    }
    
    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // Vertical centering
    const totalHeight = wrapText(ctx, description.toLowerCase(), margin, 0, availableWidth, lineHeight, false, highlightColor)
    const startY = (canvas.height - totalHeight) / 2
    
    // Adjust if it pushes against top margin
    const finalY = Math.max(margin, startY)
    
    wrapText(ctx, description.toLowerCase(), margin, finalY, availableWidth, lineHeight, true, highlightColor)
  }

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, draw: boolean = true, hColor?: string) => {
    const lines = text.split('\n')
    let currentY = y
    let initialY = y
    let totalHeight = 0

    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(' ')
        let currentX = x
        let isHighlighted = false
        const defaultColor = ctx.fillStyle as string

        for (let n = 0; n < words.length; n++) {
            let word = words[n]
            if (word === '') continue // Handle multiple spaces
            
            let startsHighlight = word.startsWith('**')
            let endsHighlight = word.endsWith('**')
            
            let cleanWord = word.replace(/\*\*/g, '')
            
            const spaceWidth = ctx.measureText(' ').width
            const wordWidth = ctx.measureText(cleanWord).width
            
            if (currentX + wordWidth > x + maxWidth && n > 0) {
                currentY += lineHeight
                currentX = x
            }
            
            if (startsHighlight) isHighlighted = true

            if (draw) {
                ctx.fillStyle = isHighlighted ? (hColor || defaultColor) : defaultColor
                ctx.fillText(cleanWord, currentX, currentY)
            }
            
            currentX += wordWidth + spaceWidth
            
            if (endsHighlight) isHighlighted = false
        }
        
        if (i < lines.length - 1 || words.length > 0) {
            currentY += lineHeight
        }
    }
    
    return currentY - initialY
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
        alert('Download failed. This can still happen with certain protected websites. Try uploading the image to your media collection instead.')
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
              }}
            >
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.companyName}</option>
              ))}
            </select>
          </div>

          {/* Custom Logo Override */}
          <div className="space-y-4">
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

            {/* SVG Logo Color Recolor */}
            {svgColors.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <Palette className="w-3 h-3" /> Logo Colours
                </label>
                <div className="flex flex-wrap gap-2">
                  {svgColors.map((color) => (
                    <label 
                      key={color}
                      className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                      style={{ 
                          borderColor: svgColorMap[color] !== color ? 'var(--admin-accent)' : 'transparent',
                          backgroundColor: 'var(--admin-bg)'
                      }}
                      title={`Original: ${color}`}
                    >
                      <div className="w-full h-full rounded-full shadow-sm" 
                           style={{ backgroundColor: svgColorMap[color] || color }} />
                      <input 
                        type="color" 
                        value={svgColorMap[color] || color} 
                        onChange={(e) => {
                          setSvgColorMap(prev => ({
                            ...prev,
                            [color]: e.target.value
                          }))
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <Type className="w-4 h-4" /> Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['home', 'features', 'description'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border"
                  style={{ 
                    backgroundColor: contentType === type ? 'var(--admin-accent)' : 'var(--admin-bg)',
                    color: contentType === type ? 'var(--admin-accent-text)' : 'var(--admin-text)',
                    borderColor: contentType === type ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                    boxShadow: contentType === type ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {contentType === 'home' && (
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>Layout Variation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'horizontal', label: 'Horizontal' },
                  { id: 'vertical', label: 'Vertical' }
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setHomeVariation(v.id as any)}
                    className="px-3 py-2 rounded-lg text-[10px] font-bold border uppercase tracking-wider transition-all"
                    style={{ 
                      borderColor: homeVariation === v.id ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                      backgroundColor: homeVariation === v.id ? 'rgba(var(--admin-accent), 0.1)' : 'var(--admin-bg)',
                      color: homeVariation === v.id ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Content Editor */}
          {contentType === 'description' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--admin-text-muted)' }}>
                  <RefreshCw className="w-3 h-3" /> Edit Content
                </div>
                <div className="text-[10px] font-medium opacity-60" style={{ color: 'var(--admin-text-muted)' }}>
                  Use **word** to highlight
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>Description</label>
                <textarea 
                  className="w-full bg-transparent border rounded-lg p-2 outline-none text-sm min-h-[80px]"
                  style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {contentType === 'features' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <RefreshCw className="w-4 h-4" /> Edit Features
                </label>
                <button 
                  onClick={() => setEditableFeatures([...editableFeatures, { title: 'New Feature', description: '' }])}
                  className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors uppercase font-bold"
                >
                  + Add Feature
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {editableFeatures.map((f, i) => (
                  <div key={i} className="space-y-2 relative group pt-4 first:pt-0 border-t first:border-0" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
                    <button 
                      onClick={() => setEditableFeatures(editableFeatures.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold opacity-50" style={{ color: 'var(--admin-text-muted)' }}>Feature {i + 1} Title</label>
                      <input 
                        type="text"
                        className="w-full bg-transparent border-b outline-none text-sm py-1"
                        style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
                        value={f.title}
                        onChange={(e) => {
                          const newFeatures = [...editableFeatures]
                          newFeatures[i].title = e.target.value
                          setEditableFeatures(newFeatures)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold opacity-50" style={{ color: 'var(--admin-text-muted)' }}>Description</label>
                      <textarea 
                        className="w-full bg-transparent border rounded-lg p-2 outline-none text-xs min-h-[60px]"
                        style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
                        value={f.description}
                        onChange={(e) => {
                          const newFeatures = [...editableFeatures]
                          newFeatures[i].description = e.target.value
                          setEditableFeatures(newFeatures)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logo Selection Refactored */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
            {/* Style Selection for Current Context (Main or Home) */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between" style={{ color: 'var(--admin-text-muted)' }}>
                <span>{contentType === 'home' ? 'Logo Style' : 'Sidewalk Logo Style'}</span>
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'logo.svg', label: 'Full Logo' },
                  { id: 'logo2.svg', label: 'Icon Only' },
                  { id: 'none', label: 'None' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => contentType === 'home' ? setHomeLogoVariant(s.id as SidewalkLogoStyle) : setLogoVariant(s.id as SidewalkLogoStyle)}
                    className="flex-1 py-2 rounded-lg border-2 transition-all text-[10px] font-bold uppercase tracking-wider hover:scale-105"
                    style={{ 
                      borderColor: (contentType === 'home' ? homeLogoVariant === s.id : logoVariant === s.id) ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                      backgroundColor: 'var(--admin-bg)',
                      color: (contentType === 'home' ? homeLogoVariant === s.id : logoVariant === s.id) ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Logo (Watermark) Style - only if in home template but want to change corner logo specifically */}
            {contentType === 'home' && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between" style={{ color: 'var(--admin-text-muted)' }}>
                  <span>Corner Logo Style</span>
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'logo.svg', label: 'Full Logo' },
                    { id: 'logo2.svg', label: 'Icon Only' },
                    { id: 'none', label: 'None' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setLogoVariant(s.id as SidewalkLogoStyle)}
                      className="flex-1 py-2 rounded-lg border-2 transition-all text-[10px] font-bold uppercase tracking-wider hover:scale-105"
                      style={{ 
                        borderColor: logoVariant === s.id ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                        backgroundColor: 'var(--admin-bg)',
                        color: logoVariant === s.id ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sidewalk Logo Color Customization */}
            {(logoVariant !== 'none' || (contentType === 'home' && homeLogoVariant !== 'none')) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    Light Presets
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {SIDEWALK_LOGO_LIGHT_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setSidewalkLogoColorMap(p.colors)}
                        className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                        style={{ 
                          borderColor: JSON.stringify(sidewalkLogoColorMap) === JSON.stringify(p.colors) ? 'var(--admin-accent)' : 'transparent',
                          backgroundColor: 'var(--admin-bg)',
                        }}
                        title={p.name}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-sm" 
                          style={{ 
                            background: `conic-gradient(${p.colors['#CD5037']} 0deg 120deg, ${p.colors['#E5BF55']} 120deg 240deg, ${p.colors['#FCF5EB']} 240deg 360deg)` 
                          }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    Dark Presets
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {SIDEWALK_LOGO_DARK_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setSidewalkLogoColorMap(p.colors)}
                        className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                        style={{ 
                          borderColor: JSON.stringify(sidewalkLogoColorMap) === JSON.stringify(p.colors) ? 'var(--admin-accent)' : 'transparent',
                          backgroundColor: 'var(--admin-bg)',
                        }}
                        title={p.name}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-sm" 
                          style={{ 
                            background: `conic-gradient(${p.colors['#CD5037']} 0deg 120deg, ${p.colors['#E5BF55']} 120deg 240deg, ${p.colors['#FCF5EB']} 240deg 360deg)` 
                          }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    <Palette className="w-3 h-3" /> Custom Colours
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: '#CD5037', label: 'Red' },
                      { id: '#E5BF55', label: 'Yellow' },
                      { id: '#FCF5EB', label: 'Cream' }
                    ].map((color) => (
                      <label 
                        key={color.id}
                        className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                        style={{ 
                            borderColor: sidewalkLogoColorMap[color.id] !== color.id ? 'var(--admin-accent)' : 'transparent',
                            backgroundColor: 'var(--admin-bg)'
                        }}
                        title={color.label}
                      >
                        <div className="w-full h-full rounded-full shadow-sm" 
                             style={{ backgroundColor: sidewalkLogoColorMap[color.id] || color.id }} />
                        <input 
                          type="color" 
                          value={sidewalkLogoColorMap[color.id] || color.id} 
                          onChange={(e) => {
                            setSidewalkLogoColorMap(prev => ({
                              ...prev,
                              [color.id]: e.target.value
                            }))
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
          <div className="space-y-4">
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
                    className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5"
                    style={{ 
                        borderColor: 'transparent',
                        backgroundColor: 'var(--admin-bg)'
                    }}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: t.color }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Text Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <Palette className="w-4 h-4" /> Text Color
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: '#CD5037', label: 'Red', class: 'bg-[#CD5037]' },
                    { id: '#E5BF55', label: 'Yellow', class: 'bg-[#E5BF55]' },
                    { id: '#FCF5EB', label: 'Cream', class: 'bg-[#FCF5EB]' },
                    { id: '#212C34', label: 'Blue', class: 'bg-[#212C34]' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setTextColor(c.id)}
                      className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5"
                      style={{ 
                          borderColor: textColor === c.id ? 'var(--admin-accent)' : 'transparent',
                          backgroundColor: 'var(--admin-bg)'
                      }}
                      title={c.label}
                    >
                      <div className={`w-full h-full rounded-full ${c.class} shadow-sm`} />
                    </button>
                  ))}
                  
                  {/* Custom Rainbow Color Picker */}
                  <label 
                    className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                    style={{ 
                        borderColor: !['#CD5037', '#E5BF55', '#FCF5EB', '#212C34'].includes(textColor.toUpperCase()) ? 'var(--admin-accent)' : 'transparent',
                        backgroundColor: 'var(--admin-bg)'
                    }}
                    title="Custom Color"
                  >
                    <div className="w-full h-full rounded-full shadow-sm" 
                         style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                </div>
              </div>


              {/* Highlight Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <Palette className="w-4 h-4" /> Highlight Color
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: '#CD5037', label: 'Red', class: 'bg-[#CD5037]' },
                    { id: '#E5BF55', label: 'Yellow', class: 'bg-[#E5BF55]' },
                    { id: '#FCF5EB', label: 'Cream', class: 'bg-[#FCF5EB]' },
                    { id: '#212C34', label: 'Blue', class: 'bg-[#212C34]' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setHighlightColor(c.id)}
                      className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5"
                      style={{ 
                          borderColor: highlightColor === c.id ? 'var(--admin-accent)' : 'transparent',
                          backgroundColor: 'var(--admin-bg)'
                      }}
                      title={c.label}
                    >
                      <div className={`w-full h-full rounded-full ${c.class} shadow-sm`} />
                    </button>
                  ))}
                  
                  {/* Custom Rainbow Color Picker */}
                  <label 
                    className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                    style={{ 
                        borderColor: !['#CD5037', '#E5BF55', '#FCF5EB', '#212C34'].includes(highlightColor.toUpperCase()) ? 'var(--admin-accent)' : 'transparent',
                        backgroundColor: 'var(--admin-bg)'
                    }}
                    title="Custom Color"
                  >
                    <div className="w-full h-full rounded-full shadow-sm" 
                         style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                    <input 
                      type="color" 
                      value={highlightColor} 
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {contentType === 'features' && (selectedClient?.features?.length || 0) > 1 && (
            <div className="space-y-2">
               <label className="text-sm font-medium flex items-center justify-between" style={{ color: 'var(--admin-text-muted)' }}>
                <span>Jump to Feature</span>
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

          {/* Background Colour */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
              <Palette className="w-4 h-4" /> Background Colour
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-1.5">
                {[
                  { id: '#CD5037', label: 'Red', class: 'bg-[#CD5037]' },
                  { id: '#E5BF55', label: 'Yellow', class: 'bg-[#E5BF55]' },
                  { id: '#FCF5EB', label: 'Cream', class: 'bg-[#FCF5EB]' },
                  { id: '#212C34', label: 'Blue', class: 'bg-[#212C34]' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setBgColor(c.id)}
                    className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5"
                    style={{ 
                        borderColor: bgColor === c.id ? 'var(--admin-accent)' : 'transparent',
                        backgroundColor: 'var(--admin-bg)'
                    }}
                    title={c.label}
                  >
                    <div className={`w-full h-full rounded-full ${c.class} shadow-sm`} />
                  </button>
                ))}
                
                {/* Custom Rainbow Color Picker */}
                <label 
                  className="w-8 h-8 rounded-full border border-zinc-500/20 transition-all hover:scale-110 flex items-center justify-center p-0.5 cursor-pointer relative"
                  style={{ 
                      borderColor: !['#CD5037', '#E5BF55', '#FCF5EB', '#212C34'].includes(bgColor.toUpperCase()) ? 'var(--admin-accent)' : 'transparent',
                      backgroundColor: 'var(--admin-bg)'
                  }}
                  title="Custom Color"
                >
                  <div className="w-full h-full rounded-full shadow-sm" 
                       style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>
          </div>

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

          {/* Background Image */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                <ImageIcon className="w-4 h-4" /> Custom Background
              </label>
              {customBgUrl && (
                <button onClick={() => setCustomBgUrl('')} className="text-[10px] font-bold uppercase text-red-500 hover:text-red-600">
                  Clear
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Paste Image URL..."
                className="w-full bg-transparent border rounded-lg p-2 outline-none text-[10px]"
                style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
                value={customBgUrl.startsWith('data:') ? '' : customBgUrl}
                onChange={(e) => setCustomBgUrl(e.target.value)}
              />
              
              <div className="flex items-center gap-2 py-1">
                <div className="h-[1px] flex-1 bg-zinc-500/10" />
                <span className="text-[9px] font-bold text-zinc-500">OR</span>
                <div className="h-[1px] flex-1 bg-zinc-500/10" />
              </div>
              
              <label className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-zinc-500/5 transition-colors"
                     style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text-muted)' }}>
                <Upload className="w-3 h-3" />
                <span className="text-[10px] font-medium uppercase font-bold tracking-wider">Upload File</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (rev) => setCustomBgUrl(rev.target?.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>

            {customBgUrl && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                      Zoom
                    </label>
                    <span className="text-[10px] font-mono">{bgZoom.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={bgZoom}
                    onChange={(e) => setBgZoom(parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                      Darken
                    </label>
                    <span className="text-[10px] font-mono">{Math.round(bgOverlayOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={bgOverlayOpacity}
                    onChange={(e) => setBgOverlayOpacity(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            )}
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
      <div className="lg:col-span-8 flex flex-col items-center lg:sticky lg:top-6 self-start">
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
