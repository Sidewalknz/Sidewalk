'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import './styles.css'

type Tab = 'home' | 'about' | 'skills' | 'projects' | 'contact'

type Project = {
  id: string
  name: string
  description: string
  features: string[]
  gallery: string[] // Image URLs or paths
}

const projects: Project[] = [
  {
    id: 'student-tours',
    name: 'the student tours',
    description: '',
    features: [],
    gallery: []
  },
  {
    id: 'under-the-hood-bbq',
    name: 'under the hood bbq',
    description: '',
    features: [],
    gallery: []
  }
]

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: 'home', label: 'Home', color: '#F3ECE3' }, // cream
  { id: 'about', label: 'About', color: '#B74831' }, // red
  { id: 'skills', label: 'Services', color: '#D7B350' }, // yellow
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

const getPageTitle = (tab: Tab, selectedProject?: Project | null): string => {
  switch (tab) {
    case 'home':
      return 'web solutions'
    case 'about':
      return 'about'
    case 'skills':
      return 'services'
    case 'projects':
      return selectedProject ? selectedProject.name : 'projects'
    case 'contact':
      return 'contact'
    default:
      return 'web solutions'
  }
}

const getPageTagline = (tab: Tab): React.ReactNode => {
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
          we offer comprehensive web services that power scalable, self-hosted solutions. our services include <span className="tagline-highlight">custom web development</span> with modern frameworks, <span className="tagline-highlight">content management systems</span> tailored to your needs, and <span className="tagline-highlight">self-hosted infrastructure</span> solutions that give you complete control over your digital presence.
        </>
      )
    case 'projects':
      // Projects tagline is now shown in column 2 when no project is selected
      return null
    case 'contact':
      return (
        <>
          ready to start your next<br />
          project? we'd love to <span className="tagline-highlight">hear</span><br />
          <span className="tagline-highlight">from you</span>. whether you<br />
          need a new <span className="tagline-highlight">website</span>, a<br />
          <span className="tagline-highlight">custom web application</span>, or<br />
          help with your <span className="tagline-highlight">existing</span><br />
          <span className="tagline-highlight">platform</span>, we're here to<br />
          help. <span className="tagline-highlight">reach out</span> and let's<br />
          build something together.
        </>
      )
    default:
      return null
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectsList, setProjectsList] = useState<Project[]>(projects)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState<string>('')
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

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]

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

  // Animation function for tagline words - animates columns first, then words within each column
  const animateTaglineWords = () => {
    if (taglineRef.current) {
      // Kill existing timeline
      if (taglineTimelineRef.current) {
        taglineTimelineRef.current.kill()
      }

      const tl = gsap.timeline()

      // Handle 4-column layout for all tabs
      const col1 = taglineRef.current.querySelector('.contact-tagline-col-1')
      const col2 = taglineRef.current.querySelector('.contact-tagline-col-2')
      const col3 = taglineRef.current.querySelector('.contact-tagline-col-3')
      const col4 = taglineRef.current.querySelector('.contact-tagline-col-4')

      // Animate column 1 first
      if (col1) {
        gsap.set(col1, { opacity: 0, y: 30 })
        const words = col1.querySelectorAll('.tagline-word')
        if (words.length > 0) {
          gsap.set(words, { opacity: 0, y: 20 })
        }

        tl.to(col1, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        })

        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, 0.1 + index * 0.05)
        })
      }

      // Animate columns 2, 3, and 4 (empty columns)
      const emptyCols = [col2, col3, col4].filter(Boolean)
      emptyCols.forEach((col, colIndex) => {
        if (col) {
          gsap.set(col, { opacity: 0, y: 30 })
          tl.to(col, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          }, `+=${0.1 + colIndex * 0.1}`)
        }
      })

      taglineTimelineRef.current = tl
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

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          if (data.projects && data.projects.length > 0) {
            setProjectsList(data.projects)
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Keep the default projects array if API fails
      }
    }

    if (activeTab === 'projects') {
      fetchProjects()
    }
  }, [activeTab])

  // Reset selected project when switching away from projects tab
  useEffect(() => {
    if (activeTab !== 'projects') {
      setSelectedProject(null)
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
    }
  }, [activeTab, selectedProject])

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
          src="/logo1.svg" 
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
        <div className="swiss-title-middle">
          {getPageTitle(activeTab, selectedProject)}
        </div>
        <div className="swiss-title-bottom-container">
          <div ref={sidewalkBottomRef} className="swiss-title-bottom">SIDEWALK</div>
          {(getPageTagline(activeTab) || activeTab === 'projects') && (
            <div ref={taglineRef} className="swiss-title-tagline">
              <div className="contact-tagline-columns">
                <div className="contact-tagline-col-1">
                  {activeTab === 'projects' ? (
                    <div className="project-list">
                      {projectsList.map((project) => (
                        <button
                          key={project.id}
                          className={`project-name-btn ${selectedProject?.id === project.id ? 'active' : ''}`}
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    wrapWords(getPageTagline(activeTab))
                  )}
                </div>
                <div className="contact-tagline-col-2">
                  {activeTab === 'projects' && selectedProject && (
                    <div className="project-description">
                      {selectedProject.description || 'No description available.'}
                    </div>
                  )}
                  {activeTab === 'projects' && !selectedProject && (
                    <>
                      {wrapWords(
                        <>
                          our portfolio showcases<br />
                          <span className="tagline-highlight">modern web applications</span><br />
                          built with comprehensive<br />
                          <span className="tagline-highlight">services</span>. each project<br />
                          represents our<br />
                          commitment to <span className="tagline-highlight">self-hosted</span><br />
                          solutions, <span className="tagline-highlight">custom</span><br />
                          <span className="tagline-highlight">integrations</span>, and <span className="tagline-highlight">beautiful</span><br />
                          <span className="tagline-highlight">user experiences</span> that help<br />
                          <span className="tagline-highlight">businesses</span> thrive online.
                        </>
                      )}
                    </>
                  )}
                  {activeTab === 'contact' && (
                    <div className="social-links">
                      <a href="https://www.facebook.com/profile.php?id=61581022527859" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="https://www.instagram.com/sidewalk.co.nz/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
                <div className="contact-tagline-col-3">
                  {activeTab === 'projects' && selectedProject && (
                    <div className="project-features">
                      {selectedProject.features && selectedProject.features.length > 0 ? (
                        <ul className="features-list">
                          {selectedProject.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <div>No features listed.</div>
                      )}
                    </div>
                  )}
                  {activeTab === 'contact' && (
                    <>
                      <div><a href="mailto:admin@sidewalks.co.nz" className="contact-email-link">admin@sidewalks.co.nz</a></div>
                      <div>nelson, new zealand</div>
                    </>
                  )}
                </div>
                <div className="contact-tagline-col-4">
                  {activeTab === 'projects' && selectedProject && (
                    <div className="project-gallery">
                      {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                        <div className="gallery-grid">
                          {selectedProject.gallery.map((image, index) => (
                            <div key={index} className="gallery-item">
                              <Image
                                src={image}
                                alt={`${selectedProject.name} gallery image ${index + 1}`}
                                width={400}
                                height={300}
                                className="gallery-image"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>No gallery images available.</div>
                      )}
                    </div>
                  )}
                  {activeTab === 'contact' && (
                    <form className="contact-form-fields" onSubmit={async (e) => {
                      e.preventDefault()
                      setFormStatus('loading')
                      setFormError('')

                      try {
                        const response = await fetch('/api/contact', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(formData),
                        })

                        const data = await response.json()

                        if (!response.ok) {
                          throw new Error(data.error || 'Failed to send message')
                        }

                        setFormStatus('success')
                        setFormData({ name: '', email: '', message: '' })
                        
                        // Reset status after 3 seconds
                        setTimeout(() => {
                          setFormStatus('idle')
                        }, 3000)
                      } catch (error) {
                        setFormStatus('error')
                        setFormError(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
                      }
                    }}>
                      <div className="contact-form-field">
                        <input
                          type="text"
                          className="contact-input"
                          placeholder="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={formStatus === 'loading'}
                        />
                      </div>
                      <div className="contact-form-field">
                        <input
                          type="email"
                          className="contact-input"
                          placeholder="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={formStatus === 'loading'}
                        />
                      </div>
                      <div className="contact-form-field">
                        <textarea
                          className="contact-textarea"
                          placeholder="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          disabled={formStatus === 'loading'}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="contact-submit-btn"
                        disabled={formStatus === 'loading'}
                      >
                        {formStatus === 'loading' ? 'sending...' : formStatus === 'success' ? 'sent!' : 'send'}
                      </button>
                      {formError && (
                        <div className="contact-form-error">
                          {formError}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
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

