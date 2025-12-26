'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import type { Client } from '@/payload-types'
import './styles.css'

type Tab = 'home' | 'about' | 'skills' | 'projects' | 'contact'

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: 'home', label: 'Home', color: '#F3ECE3' }, // cream
  { id: 'about', label: 'About', color: '#B74831' }, // red
  { id: 'skills', label: 'Technologies', color: '#D7B350' }, // yellow
  { id: 'projects', label: 'Projects', color: '#1C2830' }, // brand color
  { id: 'contact', label: 'Contact', color: '#F3ECE3' }, // cream
]

// Helper function to wrap words in spans for animation
const wrapWords = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string') {
    // Split by spaces and wrap each word
    const words = node.split(/(\s+)/)
    return words.map((word, index) => {
      if (word.match(/^\s+$/)) {
        // Preserve whitespace
        return <React.Fragment key={index}>{word}</React.Fragment>
      }
      return (
        <span key={index} className="tagline-word">
          {word}
        </span>
      )
    })
  }

  if (React.isValidElement(node)) {
    const props = node.props as { className?: string; children?: React.ReactNode }
    
    // If it's a span with className, preserve it but process children
    if (node.type === 'span' && props.className) {
      return React.cloneElement(node as React.ReactElement<{ className?: string; children?: React.ReactNode }>, {
        key: node.key,
        children: wrapWords(props.children),
      } as any)
    }
    
    // If it's a br tag, preserve it
    if (node.type === 'br') {
      return node
    }

    // For other elements, process children
    if (props && props.children) {
      return React.cloneElement(node as React.ReactElement<{ children?: React.ReactNode }>, {
        key: node.key,
        children: wrapWords(props.children),
      } as any)
    }
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>{wrapWords(child)}</React.Fragment>
    ))
  }

  return node
}

const getPageTitle = (tab: Tab, selectedClient?: Client | null): string => {
  switch (tab) {
    case 'home':
      return 'web solutions'
    case 'about':
      return 'about'
    case 'skills':
      return 'technology'
    case 'projects':
      return selectedClient?.companyName || 'projects'
    case 'contact':
      return 'contact'
    default:
      return 'web solutions'
  }
}

const getPageTagline = (tab: Tab, selectedClient?: Client | null): React.ReactNode => {
  switch (tab) {
    case 'home':
      return (
        <>
          empowering businesses with <span className="tagline-highlight">self-hosted</span> web solutions that <span className="tagline-highlight">streamline</span> workflow and <span className="tagline-highlight">elevate</span> their digital presence
        </>
      )
    case 'about':
      return (
        <>
          we're a nelson-based duo passionate about crafting websites and building brands that connect. at sidewalk, we bring <span className="tagline-highlight-dark">design and development</span> together to help companies stand out online.
          <br />
          <br />
          we believe in <span className="tagline-highlight-dark">self-hosting</span> solutions that give you complete control over your digital presence, and we're committed to building tools that improve <span className="tagline-highlight-dark">business workflow</span> and empower companies to work more efficiently.
        </>
      )
    case 'skills':
      return (
        <>
          we specialize in modern web technologies that power scalable, self-hosted solutions. our current stack includes <span className="tagline-highlight">next.js</span> for production-ready react applications, <span className="tagline-highlight">payload</span> for flexible content management, and <span className="tagline-highlight">postgres</span> for robust data storage.
        </>
      )
    case 'projects':
      // Projects content is handled separately in the JSX
      return null
    case 'contact':
      return (
        <>
          ready to start your next project? we'd love to hear from you. whether you need a new website, a custom web application, or help with your existing platform, we're here to help. reach out and let's build something together.
        </>
      )
    default:
      return null
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs for animated elements
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const sidewalkTopRef = useRef<HTMLDivElement>(null)
  const sidewalkBottomRef = useRef<HTMLDivElement>(null)
  const sidewalkTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const taglineTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const projectsTaglineRef = useRef<HTMLDivElement>(null)
  const projectsTaglineTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]

  // Fetch clients when projects tab is active
  useEffect(() => {
    if (activeTab === 'projects') {
      fetch('/api/clients?depth=2&limit=100')
        .then(res => res.json())
        .then(data => {
          if (data.docs && data.docs.length > 0) {
            setClients(data.docs)
          }
        })
        .catch(err => console.error('Error fetching clients:', err))
    }
  }, [activeTab])

  // Reset selected client when leaving projects tab
  useEffect(() => {
    if (activeTab !== 'projects') {
      setSelectedClient(null)
    }
  }, [activeTab])

  // Animation function for sidewalk texts
  const animateSidewalkTexts = () => {
    if (!sidewalkTopRef.current || !sidewalkBottomRef.current) return

    // Kill existing timeline
    if (sidewalkTimelineRef.current) {
      sidewalkTimelineRef.current.kill()
    }

    // Calculate the distance between top and bottom texts
    // Both texts should start overlapping at the middle position
    // Top text starts from below (positive y) and moves up to its position
    // Bottom text starts from above (negative y) and moves down to its position
    // Use a larger offset to ensure proper overlap (scales with viewport)
    const offset = Math.max(100, window.innerHeight * 0.12) // Responsive offset

    // Set initial positions - both texts overlapping at the middle
    // Top text starts below its final position
    gsap.set(sidewalkTopRef.current, {
      y: offset, // Start below, will move up to 0
      opacity: 1,
    })
    
    // Bottom text starts above its final position
    gsap.set(sidewalkBottomRef.current, {
      y: -offset, // Start above, will move down to 0
      opacity: 1,
    })

    // Create new timeline
    const tl = gsap.timeline()

    // Animate both texts to their final positions simultaneously
    tl.to(sidewalkTopRef.current, {
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0)
    
    tl.to(sidewalkBottomRef.current, {
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, 0) // Start both animations at the same time

    sidewalkTimelineRef.current = tl
  }

  // Animation function for tagline words
  const animateTaglineWords = () => {
    // Animate regular tagline
    if (taglineRef.current) {
      // Kill existing timeline
      if (taglineTimelineRef.current) {
        taglineTimelineRef.current.kill()
      }

      // Get all tagline words
      const words = taglineRef.current.querySelectorAll('.tagline-word')
      if (words.length > 0) {
        // Set initial state for all words
        gsap.set(words, {
          opacity: 0,
          y: 20,
        })

        // Create new timeline
        const tl = gsap.timeline()

        // Animate each word in sequence
        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, index * 0.05) // Stagger by 0.05 seconds for faster word-by-word animation
        })

        taglineTimelineRef.current = tl
      }
    }

    // Animate projects tagline
    if (projectsTaglineRef.current) {
      // Kill existing timeline
      if (projectsTaglineTimelineRef.current) {
        projectsTaglineTimelineRef.current.kill()
      }

      // Get all tagline words in projects tagline
      const words = projectsTaglineRef.current.querySelectorAll('.tagline-word')
      if (words.length > 0) {
        // Set initial state for all words
        gsap.set(words, {
          opacity: 0,
          y: 20,
        })

        // Create new timeline
        const tl = gsap.timeline()

        // Animate each word in sequence
        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, index * 0.05) // Stagger by 0.05 seconds for faster word-by-word animation
        })

        projectsTaglineTimelineRef.current = tl
      }
    }
  }

  // Animation function
  const animateContentIn = (tab: Tab) => {
    if (!contentRef.current) return

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Reset content position
    gsap.set(contentRef.current, { opacity: 0, y: 30 })

    // Create new timeline
    const tl = gsap.timeline()

    // Animate content in
    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    })

    timelineRef.current = tl
  }

  // Animate sidewalk texts on mount and tab changes
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      animateSidewalkTexts()
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (sidewalkTimelineRef.current) {
        sidewalkTimelineRef.current.kill()
        sidewalkTimelineRef.current = null
      }
    }
  }, [activeTab])

  // Animate tab changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready after React render
    const rafId = requestAnimationFrame(() => {
      if (contentRef.current) {
        animateContentIn(activeTab)
      }
      // Animate tagline words
      animateTaglineWords()
    })

    // Cleanup on unmount or before next animation
    return () => {
      cancelAnimationFrame(rafId)
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
      if (taglineTimelineRef.current) {
        taglineTimelineRef.current.kill()
        taglineTimelineRef.current = null
      }
      if (projectsTaglineTimelineRef.current) {
        projectsTaglineTimelineRef.current.kill()
        projectsTaglineTimelineRef.current = null
      }
    }
  }, [activeTab, selectedClient])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return

      e.preventDefault()
      e.stopPropagation()
      isScrollingRef.current = true

      setActiveTab((currentTab) => {
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab)
        
        if (e.deltaY > 0) {
          // Scrolling down - go to next tab
          const nextIndex = Math.min(currentIndex + 1, tabs.length - 1)
          if (nextIndex !== currentIndex) {
            return tabs[nextIndex].id
          }
        } else if (e.deltaY < 0) {
          // Scrolling up - go to previous tab
          const prevIndex = Math.max(currentIndex - 1, 0)
          if (prevIndex !== currentIndex) {
            return tabs[prevIndex].id
          }
        }
        
        return currentTab
      })

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 800)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="website" style={{ backgroundColor: activeTabData.color }}>
      {/* Logo */}
      <div className="logo-container">
        <Image 
          src={activeTab === 'projects' ? "/logo.svg" : "/logo1.svg"} 
          alt="sidewalk" 
          width={120} 
          height={40} 
        />
      </div>

      {/* Swiss Typography Title */}
      <div 
        className={`swiss-title ${activeTab === 'about' || activeTab === 'projects' ? 'swiss-title-light' : 'swiss-title-dark'}`}
        style={{ '--bg-color': activeTabData.color } as React.CSSProperties}
      >
        <div ref={sidewalkTopRef} className="swiss-title-top">SIDEWALK</div>
        <div className={`swiss-title-middle ${activeTab === 'projects' && !selectedClient ? 'projects-title' : ''}`}>
          {getPageTitle(activeTab, selectedClient)}
        </div>
        <div className="swiss-title-bottom-container">
          <div ref={sidewalkBottomRef} className="swiss-title-bottom">SIDEWALK</div>
          {activeTab === 'projects' ? (
            <div ref={projectsTaglineRef} className="swiss-title-tagline projects-tagline">
              {selectedClient ? (
                <div className="projects-tagline-columns">
                  {/* Column 1: All Projects */}
                  <div className="projects-tagline-col-1">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        className={`projects-company-link ${selectedClient.id === client.id ? 'active' : ''}`}
                        onClick={() => setSelectedClient(client)}
                      >
                        {client.companyName}
                      </button>
                    ))}
                  </div>
                  
                  {/* Column 2: Description */}
                  <div className="projects-tagline-col-2">
                    {selectedClient.description && <div className="project-detail-section">{wrapWords(selectedClient.description)}</div>}
                  </div>
                  
                  {/* Column 3: Features */}
                  <div className="projects-tagline-col-3">
                    {selectedClient.features && selectedClient.features.length > 0 && (
                      <div className="project-detail-section">
                        {selectedClient.features.map((feature, index) => (
                          <div key={feature.id || index} className="project-feature">
                            {wrapWords(feature.feature)}{feature.description && wrapWords(` — ${feature.description}`)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Column 4: Gallery */}
                  <div className="projects-tagline-col-4">
                    {selectedClient.gallery && selectedClient.gallery.length > 0 && (
                      <div className="project-gallery">
                        {selectedClient.gallery.map((item, index) => {
                          const image = typeof item.image === 'object' && item.image !== null 
                            ? item.image 
                            : null
                          if (!image || !image.url) return null
                          
                          return (
                            <div key={item.id || index} className="project-gallery-item">
                              <Image
                                src={image.url}
                                alt={item.caption || selectedClient.companyName || 'Project image'}
                                width={image.width || 400}
                                height={image.height || 300}
                                className="project-gallery-image"
                              />
                              {item.caption && (
                                <div className="project-gallery-caption">{wrapWords(item.caption)}</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="projects-tagline-columns projects-tagline-columns-initial">
                  <div className="projects-tagline-col-1">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        className="projects-company-link"
                        onClick={() => setSelectedClient(client)}
                      >
                        {client.companyName}
                      </button>
                    ))}
                  </div>
                  <div className="projects-tagline-col-2">
                    {wrapWords("our portfolio showcases modern web applications built with cutting-edge technology. each project represents our commitment to self-hosted solutions, custom integrations, and beautiful user experiences that help businesses thrive online.")}
                  </div>
                  <div className="projects-tagline-col-3"></div>
                  <div className="projects-tagline-col-4"></div>
                </div>
              )}
            </div>
          ) : (
            getPageTagline(activeTab, selectedClient) && (
              <div ref={taglineRef} className="swiss-title-tagline">
                <div className="tagline-columns">
                  <div className="tagline-col-left">
                    {wrapWords(getPageTagline(activeTab, selectedClient))}
                  </div>
                  <div className="tagline-col-right"></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {activeTab === 'home' && (
          <div ref={contentRef} className="tab-content home-content">
            {/* Content removed - using Swiss Typography title instead */}
          </div>
        )}

        {activeTab === 'about' && (
          <div ref={contentRef} className="tab-content about-content">
            {/* Content removed - using Swiss Typography title and tagline instead */}
          </div>
        )}

        {activeTab === 'skills' && (
          <div ref={contentRef} className="tab-content skills-content">
            {/* Content removed - using Swiss Typography title and tagline instead */}
          </div>
        )}

        {activeTab === 'projects' && (
          <div ref={contentRef} className="tab-content projects-content">
            {/* Content moved to tagline area */}
          </div>
        )}

        {activeTab === 'contact' && (
          <div ref={contentRef} className="tab-content contact-content">
            {/* Content removed - using Swiss Typography title and tagline instead */}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map((tab, index) => {
          const isDarkTab = tab.color === '#1C2830' || tab.color === '#B74831'
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${isDarkTab ? 'dark-tab' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ '--tab-color': tab.color } as React.CSSProperties}
              aria-label={tab.label}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 66 57"
                className="tab-shape"
                preserveAspectRatio="none"
              >
                <path
                  d="M62.33,46.69L4.49,56.79C2.14,57.2-.01,55.33,0,52.89L.24,14c.01-1.9,1.36-3.53,3.2-3.85L61.27.06c2.36-.41,4.51,1.45,4.49,3.9l-.24,38.89c-.01,1.9-1.36,3.53-3.2,3.85Z"
                  fill={tab.color}
                  className="tab-path"
                />
              </svg>
              <span className="tab-label">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
