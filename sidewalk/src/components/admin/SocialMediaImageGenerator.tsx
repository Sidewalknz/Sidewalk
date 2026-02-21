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
  aspect: 'square' | 'story' | 'fb' | 'portrait'
}

const SIZES: Size[] = [
  { width: 1440, height: 1440, label: 'Instagram Post Landscape (1440x1440)', aspect: 'square' },
  { width: 1440, height: 1918, label: 'Instagram Post Portrait (1440x1918)', aspect: 'portrait' },
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

type ContentType = 'home' | 'features' | 'description' | 'blank'
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
  const [descriptionFontSize, setDescriptionFontSize] = useState(1.0)
  const [showCoBranding, setShowCoBranding] = useState(false)
  const [backgroundType, setBackgroundType] = useState<'solid' | 'image' | 'showcase'>('solid')

  // Showcase state
  const [showcasePages, setShowcasePages] = useState<{ yOffset: number, screenshot: string | null }[]>([
    { yOffset: 0, screenshot: null },
    { yOffset: 10, screenshot: null },
    { yOffset: 20, screenshot: null },
  ])
  const [showcaseRotation, setShowcaseRotation] = useState(-15)
  const [activeShowcaseColumn, setActiveShowcaseColumn] = useState<number | null>(null)

  
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
  const [bgImageOpacity, setBgImageOpacity] = useState(1.0)
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(0.4)
  const [isDragging, setIsDragging] = useState(false)
  const [showcaseDragging, setShowcaseDragging] = useState<number | null>(null)
  const [size, setSize] = useState<Size>(SIZES[1])
  const [bgZoom, setBgZoom] = useState(1.0)
  const [svgOriginalContent, setSvgOriginalContent] = useState<string>('')
  const [svgColors, setSvgColors] = useState<string[]>([])
  const [svgColorMap, setSvgColorMap] = useState<Record<string, string>>({})
  const [sidewalkLogoColorMap, setSidewalkLogoColorMap] = useState<Record<string, string>>({
    '#CD5037': '#CD5037', // Red
    '#E5BF55': '#E5BF55', // Yellow
    '#FCF5EB': '#FCF5EB'  // Cream
  })
  
  const renderCount = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectedClient = clients.find(c => c.id == selectedClientId)

  // Fetch and parse SVG colors
  useEffect(() => {
    const fetchSvg = async () => {
      const iconUrl = customLogoUrl || selectedClient?.icon
      
      // Clear current SVG content immediately to prevent stale logos during new fetch
      setSvgOriginalContent('')

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
  }, [selectedClientId, contentType, logoPosition, logoVariant, homeLogoVariant, customLogoUrl, customBgUrl, bgOverlayOpacity, bgZoom, bgImageOpacity, homeVariation, bgColor, textColor, highlightColor, svgOriginalContent, svgColorMap, sidewalkLogoColorMap, size, editableFeatures, editableDescription, descriptionFontSize, showCoBranding, showcasePages, backgroundType, showcaseRotation])


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

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (rev) => setCustomBgUrl(rev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleShowcaseFile = (file: File, index: number) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (rev) => {
        const newPages = [...showcasePages]
        newPages[index] = { ...newPages[index], screenshot: rev.target?.result as string }
        setShowcasePages(newPages)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    // Only handle paste if we're not in an input/textarea (unless it's the custom bg input)
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (!target.classList.contains('bg-url-input')) return
    }

    const items = e.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile()
          if (file) {
            if (backgroundType === 'showcase') {
              // If a column is specifically focused, use it
              if (activeShowcaseColumn !== null) {
                handleShowcaseFile(file, activeShowcaseColumn)
              } else {
                // Smart auto-fill: find first empty column, or default to first column
                const firstEmptyIndex = showcasePages.findIndex(p => !p.screenshot)
                const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0
                handleShowcaseFile(file, targetIndex)
              }
            } else {
              handleFile(file)
            }
          }
          break
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const drawCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedClient) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Track this render cycle to avoid race conditions
    renderCount.current += 1
    const thisRender = renderCount.current

    // Background layer
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Logo size and margins
    const logoScale = 0.18
    const logoW = canvas.width * logoScale
    const logoH = logoW * 0.5
    const margin = canvas.width * 0.08

    if (backgroundType === 'image' && customBgUrl) {
        const bgImg = new Image()
        bgImg.crossOrigin = 'anonymous'
        await new Promise(resolve => {
            bgImg.onload = resolve
            bgImg.onerror = () => resolve(null)
            bgImg.src = getProxiedUrl(customBgUrl)
        })
        
        // Abort if a newer render has started
        if (thisRender !== renderCount.current) return
        
        if (bgImg.complete && bgImg.width > 0) {
            // ... (rest of image background logic)
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
            
            ctx.globalAlpha = bgImageOpacity
            ctx.drawImage(bgImg, drawX, drawY, drawW, drawH)
            ctx.globalAlpha = 1.0
        }
    } else if (backgroundType === 'showcase') {
        await drawShowcaseTemplate(ctx, canvas, margin, bgZoom, bgImageOpacity, showcaseRotation)
        // Abort if a newer render has started
        if (thisRender !== renderCount.current) return
    }

    // Apply Overlay (common for Image and Showcase)
    if (bgOverlayOpacity > 0 && backgroundType !== 'solid') {
        ctx.fillStyle = `rgba(0,0,0,${bgOverlayOpacity})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Load Sidewalk Logo Watermark
    const logoImg = logoVariant !== 'none' ? await loadSidewalkLogo(logoVariant) : null
    
    // Abort if a newer render has started
    if (thisRender !== renderCount.current) return

    // Draw Content on top of background
    if (contentType === 'home') {
        await drawHomeTemplate(ctx, canvas, margin)
        // Abort if a newer render has started
        if (thisRender !== renderCount.current) return
    } else if (contentType === 'features') {
        drawFeaturesTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'description') {
        drawDescriptionTemplate(ctx, canvas, logoImg, margin)
    } else if (contentType === 'blank') {
        drawBlankTemplate(ctx, canvas, margin)
    }

    // Draw Sidewalk Logo watermark
    if (logoImg && logoImg.complete && logoImg.width > 0) {
        ctx.globalAlpha = 1.0
        
        let logoX = margin
        let logoY = margin

        const swLogoScale = 0.22
        let swLogoW = canvas.width * swLogoScale
        const swAspect = logoImg.width / logoImg.height || 2
        let swLogoH = swLogoW / swAspect

        // Constrain height (especially for square Icon Only style)
        const maxSwH = canvas.width * 0.10 // Cap height at 10% of canvas width
        if (swLogoH > maxSwH) {
            swLogoH = maxSwH
            swLogoW = swLogoH * swAspect
        }


        const iconUrl = customLogoUrl || selectedClient?.icon
        const clientLogo = (iconUrl && showCoBranding) ? await loadClientLogo(iconUrl) : null

        if (showCoBranding && clientLogo && clientLogo.complete) {
            const clientAspect = clientLogo.width / clientLogo.height || 1
            
            // Match heights perfectly
            const clientH = swLogoH
            const clientW = clientH * clientAspect

            const gap = canvas.width * 0.05
            const xOffset = canvas.width * 0.02
            
            const totalWidth = swLogoW + gap + clientW
            const totalHeight = Math.max(swLogoH, clientH)

            if (logoPosition.includes('center')) {
                logoX = (canvas.width - totalWidth) / 2
            } else if (logoPosition.includes('right')) {
                logoX = canvas.width - totalWidth - margin
            }

            if (logoPosition.includes('bottom')) {
                logoY = canvas.height - totalHeight - margin
            }

            // Draw Sidewalk Logo (Vertically centered)
            ctx.drawImage(logoImg, logoX, logoY + (totalHeight - swLogoH) / 2, swLogoW, swLogoH)

            // Draw 'x' (Centered in the gap)
            ctx.fillStyle = textColor
            ctx.font = `bold ${canvas.width * 0.04}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.globalAlpha = 0.4
            ctx.fillText('x', logoX + swLogoW + gap / 2, logoY + totalHeight / 2)
            ctx.globalAlpha = 1.0

            // Draw Client Logo (Vertically centered)
            ctx.drawImage(clientLogo, logoX + swLogoW + gap, logoY + (totalHeight - clientH) / 2, clientW, clientH)
        } else {

            const finalSwW = swLogoW
            const finalSwAspect = logoImg.width / logoImg.height || 2
            const finalSwH = finalSwW / finalSwAspect

            if (logoPosition.includes('center')) {
                logoX = (canvas.width - finalSwW) / 2
            } else if (logoPosition.includes('right')) {
                logoX = canvas.width - finalSwW - margin
            }

            if (logoPosition.includes('bottom')) {
                logoY = canvas.height - finalSwH - margin
            }

            ctx.drawImage(logoImg, logoX, logoY, finalSwW, finalSwH)
        }

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
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    if (editableFeatures.length === 0) {
        ctx.fillStyle = textColor
        ctx.font = `${canvas.width * 0.04}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('No features found', canvas.width/2, canvas.height/2)
        return
    }

    // Determine starting area based on logo position
    // We want a clear header area
    let contentY = logoPosition.startsWith('top') ? margin * 3.5 : margin * 1.5
    
    // Determine max available height
    let maxContentHeight = canvas.height - contentY - margin
    if (logoPosition.startsWith('bottom')) {
        maxContentHeight -= margin * 2.5 // More space for logo watermark
    }

    let titleFontSize = canvas.width * 0.075 // Slightly smaller than description for better list balance
    let descFontSize = canvas.width * 0.04
    let scaleFactor = 1.0

    // Scaling loop to fit all content
    let finalTotalHeight = 0
    while (scaleFactor > 0.45) {
        let testY = 0
        const currentTitleSize = titleFontSize * scaleFactor
        const currentDescSize = descFontSize * scaleFactor
        const currentTitleLH = currentTitleSize * 1.3
        const currentDescLH = currentDescSize * 1.4

        editableFeatures.forEach((feature) => {
            ctx.font = `bold ${currentTitleSize}px sans-serif`
            testY += wrapText(ctx, feature.title.toLowerCase(), margin, 0, canvas.width - margin * 2, currentTitleLH, false)
            
            if (feature.description) {
                ctx.font = `${currentDescSize}px sans-serif`
                testY += wrapText(ctx, feature.description.toLowerCase(), margin, 0, canvas.width - margin * 2, currentDescLH, false)
                testY += margin * 0.8 * scaleFactor // More breathing room
            } else {
                testY += margin * 0.8 * scaleFactor
            }
        })

        finalTotalHeight = testY
        if (testY <= maxContentHeight) break
        scaleFactor -= 0.05
    }

    const currentTitleSize = titleFontSize * scaleFactor
    const currentDescSize = descFontSize * scaleFactor
    const currentTitleLH = currentTitleSize * 1.3
    const currentDescLH = currentDescSize * 1.4

    // Vertical centering within the target area
    let startY = contentY
    if (finalTotalHeight < maxContentHeight) {
        startY = contentY + (maxContentHeight - finalTotalHeight) / 2
    }

    let currentY = startY

    editableFeatures.forEach((feature) => {
        // Title - Use textColor by default
        ctx.fillStyle = textColor
        ctx.font = `bold ${currentTitleSize}px sans-serif`
        const titleHeight = wrapText(ctx, feature.title.toLowerCase(), margin, currentY, canvas.width - margin * 2, currentTitleLH, true, highlightColor)
        
        currentY += titleHeight

        // Description - Use textColor by default
        if (feature.description) {
            ctx.fillStyle = textColor
            ctx.font = `${currentDescSize}px sans-serif`
            ctx.globalAlpha = 0.8
            const descHeight = wrapText(ctx, feature.description.toLowerCase(), margin, currentY, canvas.width - margin * 2, currentDescLH, true, highlightColor)
            ctx.globalAlpha = 1.0
            currentY += descHeight + margin * 0.8 * scaleFactor
        } else {
            currentY += margin * 0.8 * scaleFactor
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
        ctx.font = `bold ${fontSize * descriptionFontSize}px sans-serif`
        const totalHeight = wrapText(ctx, description.toLowerCase(), margin, 0, availableWidth, lineHeight * descriptionFontSize, false, highlightColor)
        if (totalHeight <= maxContentHeight) break
        fontSize -= 2
        lineHeight = fontSize * 1.3
    }
    
    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize * descriptionFontSize}px sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // Vertical centering
    const totalHeight = wrapText(ctx, description.toLowerCase(), margin, 0, availableWidth, lineHeight * descriptionFontSize, false, highlightColor)
    const startY = (canvas.height - totalHeight) / 2
    
    // Adjust if it pushes against top margin
    const finalY = Math.max(margin, startY)
    
    wrapText(ctx, description.toLowerCase(), margin, finalY, availableWidth, lineHeight * descriptionFontSize, true, highlightColor)
  }

  const drawBlankTemplate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, margin: number) => {
    // Blank template doesn't draw text, background and watermarks (including co-branding) are already handled in drawCanvas
    return
  }

  const drawShowcaseTemplate = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, margin: number, zoom: number = 1.0, opacity: number = 1.0, rotationDeg: number = -15) => {
    const activePages = showcasePages.filter(p => !!p.screenshot)
    if (activePages.length === 0) return

    const rotation = rotationDeg * Math.PI / 180
    
    // Total width to cover rotation (overscan)
    const totalRotationWidth = (canvas.width * 1.8) * zoom
    const numActive = activePages.length
    const colWidth = totalRotationWidth / numActive
    
    // Define drawing order: sides first, then middle (to ensure middle overlaps both)
    const drawIndices = numActive === 3 ? [0, 2, 1] : Array.from({ length: numActive }, (_, i) => i)

    for (const i of drawIndices) {
        const page = activePages[i]
        
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise(resolve => {
            img.onload = resolve
            img.onerror = () => resolve(null)
            img.src = page.screenshot!
        })

        if (!img.complete || img.width === 0) continue

        ctx.save()
        
        // Position columns
        const centerX = canvas.width / 2
        const xOffsetStart = -totalRotationWidth / 2
        
        // Accurate pixel positioning to minimize seams
        const colStartX = centerX + xOffsetStart + (i * colWidth)
        const x = Math.round(colStartX + (colWidth / 2))
        const y = Math.round(canvas.height / 2)
        
        ctx.translate(x, y)
        ctx.rotate(rotation)
        
        // Cascading vertical alignment based on number of active columns
        const verticalStagger = (i - (numActive - 1) / 2) * (canvas.height * 0.15)
        
        // Use a very tall rect to ensure background is covered
      const rectH = canvas.height * 3.0
      
      // Minimal overlap now that the white fill is gone and we have image bleed
      const overlap = 2
      
      // Draw the clipping area with overlap
        // We removed the white fill() here as it was causing bright lines to bleed through
        ctx.beginPath()
        ctx.rect(Math.round(-colWidth/2 - overlap/2), Math.round(-rectH/2 + verticalStagger), Math.round(colWidth + overlap), Math.round(rectH))
        ctx.clip()
        
        // Draw screenshot part
        const imgAspect = img.width / img.height
        const baseDrawW = Math.round(colWidth + overlap)
        // Add a slight 2px bleed to ensure the image covers the anti-aliased edges of the clip perfectly
        const bleed = 2
        const drawW = baseDrawW + bleed
        const drawH = drawW / imgAspect
        
        // Scroll calculation: 0-100% represents one full image height for looping
        const scrollY = (page.yOffset / 100) * drawH
        
        // Apply individual column opacity if needed (using global opacity for now)
        ctx.globalAlpha = opacity

        // Draw image multiple times to fill the tall clipping rect (vertical tiling/looping)
        // We start drawing from the stagger point and expand upwards and downwards
        let startY = -rectH/2 + verticalStagger - (scrollY % drawH)
        
        // Ensure we start high enough to cover the top of the clipping rect
        while (startY > -rectH/2 + verticalStagger) {
            startY -= drawH
        }
        
        // Fill the clipping rect downwards
        let currentY = startY
        while (currentY < rectH/2 + verticalStagger) {
            // Centered bleed: draw slightly larger and offset by half the bleed
            ctx.drawImage(img, Math.round(-colWidth/2 - overlap/2 - bleed/2), Math.round(currentY - bleed/2), Math.round(drawW), Math.round(drawH))
            currentY += drawH
        }
        
        ctx.restore()
    }
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
              {(['home', 'features', 'description', 'blank'] as ContentType[]).map((type) => (
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


          {contentType === 'blank' && (
            <div className="space-y-4">
               <p className="text-[10px] text-zinc-500 italic">No specific content for Blank template. Use the logo and background controls below.</p>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                    Font Size
                  </label>
                  <span className="text-[10px] font-mono">{descriptionFontSize.toFixed(2)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                  value={descriptionFontSize}
                  onChange={(e) => setDescriptionFontSize(parseFloat(e.target.value))}
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
                <button 
                  onClick={() => setShowCoBranding(!showCoBranding)}
                  className="text-[10px] px-2 py-1 rounded border transition-colors uppercase font-bold"
                  style={{ 
                    backgroundColor: showCoBranding ? 'rgba(var(--admin-accent), 0.1)' : 'var(--admin-bg)',
                    borderColor: showCoBranding ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                    color: showCoBranding ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                  }}
                >
                  {showCoBranding ? 'Co-branded On' : 'Co-branded Off'}
                </button>
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


          {/* Background Customization */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--admin-sidebar-border)' }}>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                <ImageIcon className="w-4 h-4" /> Background Type
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'solid', label: 'Solid', icon: Palette },
                  { id: 'image', label: 'Image', icon: ImageIcon },
                  { id: 'showcase', label: 'Showcase', icon: Monitor }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setBackgroundType(t.id as any)}
                    className="flex-1 py-2 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1"
                    style={{ 
                      borderColor: backgroundType === t.id ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)',
                      backgroundColor: backgroundType === t.id ? 'rgba(var(--admin-accent), 0.1)' : 'var(--admin-bg)',
                      color: backgroundType === t.id ? 'var(--admin-text)' : 'var(--admin-text-muted)'
                    }}
                  >
                    <t.icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Colour (always visible as base for solid or fallback/overlay) */}
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

          {/* Show Showcase Setup when Showcase background is selected */}
          {backgroundType === 'showcase' && (
            <div className="space-y-6 pt-2">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <Monitor className="w-3 h-3" /> Showcase Columns
                </label>
                
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className={`space-y-2 p-3 rounded-lg border transition-all ${showcaseDragging === i ? 'bg-blue-500/5 ring-1 ring-blue-500' : ''} ${activeShowcaseColumn === i ? 'bg-blue-500/5 ring-2 ring-blue-500/50' : ''}`} 
                      style={{ borderColor: activeShowcaseColumn === i ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)' }}
                      onDragOver={(e) => {
                          e.preventDefault()
                          setShowcaseDragging(i)
                      }}
                      onDragLeave={() => setShowcaseDragging(null)}
                      onDrop={(e) => {
                          e.preventDefault()
                          setShowcaseDragging(null)
                          const file = e.dataTransfer.files?.[0]
                          if (file) handleShowcaseFile(file, i)
                      }}
                    >
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>Column {i + 1}</label>
                         <div className="flex items-center gap-2">
                            {showcasePages[i].screenshot && (
                              <button 
                                onClick={() => {
                                  const newPages = [...showcasePages]
                                  newPages[i].screenshot = null
                                  setShowcasePages(newPages)
                                }}
                                className="text-[9px] text-red-500 hover:text-red-600 font-bold uppercase transition-colors"
                              >
                                Clear
                              </button>
                            )}
                            {showcasePages[i].screenshot && (
                              <span className="text-[9px] text-green-500 font-bold uppercase">Ready</span>
                            )}
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleShowcaseFile(file, i)
                            }}
                          />
                          <div className="w-full py-2 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-500 border border-dashed border-zinc-500/30 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-colors">
                             <Upload className="w-3 h-3" /> Upload Image
                          </div>
                        </label>

                         <button 
                          onClick={async () => {
                            setActiveShowcaseColumn(i)
                            try {
                              const clipboardItems = await navigator.clipboard.read()
                              for (const item of clipboardItems) {
                                for (const type of item.types) {
                                  if (type.startsWith('image/')) {
                                    const blob = await item.getType(type)
                                    const file = new File([blob], "pasted-image.png", { type })
                                    handleShowcaseFile(file, i)
                                    setActiveShowcaseColumn(null)
                                    return
                                  }
                                }
                              }
                              alert('No image found in clipboard. Use Ctrl+V or copy an image first.')
                            } catch (err) {
                              console.error('Clipboard paste failed:', err)
                              // Keep the indicator active if auto-paste fails so they can still manual paste
                              alert('Permission required for one-click paste. Use Ctrl+V instead.')
                            }
                          }}
                          className={`px-3 py-2 border rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${
                            activeShowcaseColumn === i 
                            ? 'bg-blue-500 text-white border-blue-600 animate-pulse' 
                            : 'bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-500 border-zinc-500/30'
                          }`}
                          title="Paste from Clipboard (One-click)"
                        >
                          <ImageIcon className="w-3 h-3" />
                          Paste
                        </button>
                      </div>
                      
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                           <label className="text-[9px] uppercase font-bold opacity-50">Y Offset</label>
                           <span className="text-[9px] font-mono">{showcasePages[i].yOffset}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                          value={showcasePages[i].yOffset}
                          onChange={(e) => {
                             const newPages = [...showcasePages]
                             newPages[i].yOffset = parseInt(e.target.value)
                             setShowcasePages(newPages)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Shared Background Controls for Showcase */}
              <div className="space-y-4 pt-2 border-t border-zinc-500/10">
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
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                    value={bgZoom}
                    onChange={(e) => setBgZoom(parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                      Rotation
                    </label>
                    <span className="text-[10px] font-mono">{showcaseRotation}°</span>
                  </div>
                  <input 
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                    value={showcaseRotation}
                    onChange={(e) => setShowcaseRotation(parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                      Showcase Opacity
                    </label>
                    <span className="text-[10px] font-mono">{Math.round(bgImageOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                    value={bgImageOpacity}
                    onChange={(e) => setBgImageOpacity(parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                      Darken overlay
                    </label>
                    <span className="text-[10px] font-mono">{Math.round(bgOverlayOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                    value={bgOverlayOpacity}
                    onChange={(e) => setBgOverlayOpacity(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Background Image - Only show when Image background is selected */}
          {backgroundType === 'image' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                  <ImageIcon className="w-3 h-3" /> Custom Background
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
                  className="w-full bg-transparent border rounded-lg p-2 outline-none text-[10px] bg-url-input"
                  style={{ borderColor: 'var(--admin-sidebar-border)', color: 'var(--admin-text)' }}
                  value={customBgUrl.startsWith('data:') ? '' : customBgUrl}
                  onChange={(e) => setCustomBgUrl(e.target.value)}
                />
                
                <div className="flex items-center gap-2 py-1">
                  <div className="h-[1px] flex-1 bg-zinc-500/10" />
                  <span className="text-[9px] font-bold text-zinc-500">OR</span>
                  <div className="h-[1px] flex-1 bg-zinc-500/10" />
                </div>
                
                <label 
                  onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) handleFile(file)
                  }}
                  className={`w-full flex flex-col items-center justify-center gap-2 py-4 border border-dashed rounded-lg cursor-pointer transition-all ${isDragging ? 'bg-blue-500/10 border-blue-500 scale-[1.02]' : 'hover:bg-zinc-500/5'}`}
                  style={{ borderColor: isDragging ? 'var(--admin-accent)' : 'var(--admin-sidebar-border)', color: 'var(--admin-text-muted)' }}
                >
                  <Upload className={`w-4 h-4 ${isDragging ? 'text-blue-500 animate-bounce' : ''}`} />
                  <div className="text-center">
                      <span className="text-[10px] font-medium uppercase font-bold tracking-wider block">
                          {isDragging ? 'Drop Image Here' : 'Upload or Drag Image'}
                      </span>
                      {!isDragging && <span className="text-[8px] opacity-50 block mt-1">Supports Paste (Ctrl+V)</span>}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFile(file)
                    }}
                  />
                </label>
              </div>

              {customBgUrl && (
                <div className="space-y-4 pt-2">
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
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                      value={bgZoom}
                      onChange={(e) => setBgZoom(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                        Image Opacity
                      </label>
                      <span className="text-[10px] font-mono">{Math.round(bgImageOpacity * 100)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                      value={bgImageOpacity}
                      onChange={(e) => setBgImageOpacity(parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-bold" style={{ color: 'var(--admin-text-muted)' }}>
                        Darken overlay
                      </label>
                      <span className="text-[10px] font-mono">{Math.round(bgOverlayOpacity * 100)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="0.9"
                      step="0.05"
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--admin-sidebar-border)', accentColor: 'var(--admin-accent)' }}
                      value={bgOverlayOpacity}
                      onChange={(e) => setBgOverlayOpacity(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              )}
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
                        width: size.aspect === 'square' ? '500px' : size.aspect === 'portrait' ? '400px' : size.aspect === 'story' ? '300px' : '600px'
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
