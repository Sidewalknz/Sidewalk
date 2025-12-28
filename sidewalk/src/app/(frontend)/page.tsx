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

const getPageTitle = (tab: Tab, selectedClient?: Client | null): string => {
  switch (tab) {
    case 'home':
      return 'web solutions'
    case 'about':
      return 'about'
    case 'skills':
      return 'services'
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
          we offer comprehensive web services that power scalable, self-hosted solutions. our services include <span className="tagline-highlight">custom web development</span> with modern frameworks, <span className="tagline-highlight">content management systems</span> tailored to your needs, and <span className="tagline-highlight">self-hosted infrastructure</span> solutions that give you complete control over your digital presence.
        </>
      )
    case 'projects':
      // Projects content is handled separately in the JSX
      return null
    case 'contact':
      return (
        <>
          ready to start your next project? we'd love to <span className="tagline-highlight">hear from you</span>. whether you need a <span className="tagline-highlight">new website</span>, a <span className="tagline-highlight">custom web application</span>, or help with your <span className="tagline-highlight">existing platform</span>, we're here to help. <span className="tagline-highlight">reach out</span> and let's build something together.
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
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
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
  const contactFormFieldsRef = useRef<HTMLFormElement>(null)

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

  // Animation function for tagline words - animates columns first, then words within each column
  const animateTaglineWords = () => {
    // Animate regular tagline (home, about, skills - 2 columns)
    if (taglineRef.current && activeTab !== 'contact' && activeTab !== 'projects') {
      // Kill existing timeline
      if (taglineTimelineRef.current) {
        taglineTimelineRef.current.kill()
      }

      const tl = gsap.timeline()
      const colLeft = taglineRef.current.querySelector('.tagline-col-left')
      const colRight = taglineRef.current.querySelector('.tagline-col-right')

      // Animate column 1 (left) first
      if (colLeft) {
        gsap.set(colLeft, { opacity: 0, y: 30 })
        const words = colLeft.querySelectorAll('.tagline-word')
        if (words.length > 0) {
          gsap.set(words, { opacity: 0, y: 20 })
        }

        // Animate column in
        tl.to(colLeft, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        })

        // Animate words within column 1 (start during column animation)
        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, 0.1 + index * 0.05) // Start words animation 0.1s into column animation
        })
      }

      // Animate column 2 (right) after column 1
      if (colRight) {
        gsap.set(colRight, { opacity: 0, y: 30 })
        const words = colRight.querySelectorAll('.tagline-word')
        if (words.length > 0) {
          gsap.set(words, { opacity: 0, y: 20 })
        }

        // Animate column in after column 1
        tl.to(colRight, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, '+=0.2') // Start after column 1 with a small delay

        // Animate words within column 2 (start during column animation)
        words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, `-=${0.4 - index * 0.05}`) // Start words animation during column animation
        })
      }

      taglineTimelineRef.current = tl
    }

    // Animate projects tagline (4 columns)
    if (projectsTaglineRef.current) {
      // Kill existing timeline
      if (projectsTaglineTimelineRef.current) {
        projectsTaglineTimelineRef.current.kill()
      }

      const tl = gsap.timeline()
      const columns = [
        projectsTaglineRef.current.querySelector('.projects-tagline-col-1'),
        projectsTaglineRef.current.querySelector('.projects-tagline-col-2'),
        projectsTaglineRef.current.querySelector('.projects-tagline-col-3'),
        projectsTaglineRef.current.querySelector('.projects-tagline-col-4'),
      ].filter(Boolean) as Element[]

      // Animate each column in sequence (1, 2, 3, 4)
      columns.forEach((col, colIndex) => {
        if (!col) return

        gsap.set(col, { opacity: 0, y: 30 })
        const words = col.querySelectorAll('.tagline-word')
        const buttons = col.querySelectorAll('.projects-company-link')
        const images = col.querySelectorAll('.project-gallery-image')
        const captions = col.querySelectorAll('.project-gallery-caption')
        
        // Set initial state for all child elements
        if (words.length > 0) {
          gsap.set(words, { opacity: 0, y: 20 })
        }
        if (buttons.length > 0) {
          gsap.set(buttons, { opacity: 0, y: 20 })
        }
        if (images.length > 0) {
          gsap.set(images, { opacity: 0, y: 20 })
        }
        if (captions.length > 0) {
          gsap.set(captions, { opacity: 0, y: 20 })
        }

        // Calculate start time for this column (stagger by 0.3 seconds)
        const columnStartTime = colIndex * 0.3

        // Animate column in
        tl.to(col, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, columnStartTime)

        // Animate words within column (start during column animation)
        words.forEach((word, wordIndex) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + wordIndex * 0.05)
        })

        // Animate buttons within column
        buttons.forEach((button, btnIndex) => {
          tl.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + btnIndex * 0.1)
        })

        // Animate images within column
        images.forEach((image, imgIndex) => {
          tl.to(image, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + imgIndex * 0.15)
        })

        // Animate captions within column
        captions.forEach((caption, capIndex) => {
          tl.to(caption, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + capIndex * 0.1)
        })
      })

      projectsTaglineTimelineRef.current = tl
    }

    // Animate contact tagline (4 columns)
    if (activeTab === 'contact' && taglineRef.current) {
      // Kill existing timeline
      if (taglineTimelineRef.current) {
        taglineTimelineRef.current.kill()
      }

      const tl = gsap.timeline()
      const columns = [
        taglineRef.current.querySelector('.contact-tagline-col-1'),
        taglineRef.current.querySelector('.contact-tagline-col-2'),
        taglineRef.current.querySelector('.contact-tagline-col-3'),
        taglineRef.current.querySelector('.contact-tagline-col-4'),
      ].filter(Boolean) as Element[]

      // Animate each column in sequence (1, 2, 3, 4)
      columns.forEach((col, colIndex) => {
        if (!col) return

        gsap.set(col, { opacity: 0, y: 30 })
        const words = col.querySelectorAll('.tagline-word')
        const socialLinks = col.querySelectorAll('.social-link')
        const formFields = col.querySelectorAll('.contact-form-field')
        const submitBtn = col.querySelector('.contact-submit-btn')
        
        // Set initial state for all child elements
        if (words.length > 0) {
          gsap.set(words, { opacity: 0, y: 20 })
        }
        if (socialLinks.length > 0) {
          gsap.set(socialLinks, { opacity: 0, y: 20 })
        }
        if (formFields.length > 0) {
          gsap.set(formFields, { opacity: 0, y: 20 })
        }
        if (submitBtn) {
          gsap.set(submitBtn, { opacity: 0, y: 20 })
        }

        // Calculate start time for this column (stagger by 0.3 seconds)
        const columnStartTime = colIndex * 0.3

        // Animate column in
        tl.to(col, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, columnStartTime)

        // Animate words within column (start during column animation)
        words.forEach((word, wordIndex) => {
          tl.to(word, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + wordIndex * 0.05)
        })

        // Animate social links within column
        socialLinks.forEach((link, linkIndex) => {
          tl.to(link, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + linkIndex * 0.1)
        })

        // Animate form fields within column
        formFields.forEach((field, fieldIndex) => {
          tl.to(field, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + fieldIndex * 0.1)
        })

        // Animate submit button within column
        if (submitBtn) {
          tl.to(submitBtn, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
          }, columnStartTime + 0.1 + formFields.length * 0.1)
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

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setContactForm({ name: '', email: '', message: '' })
        // Reset status after 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    {wrapWords("our portfolio showcases modern web applications built with comprehensive services. each project represents our commitment to self-hosted solutions, custom integrations, and beautiful user experiences that help businesses thrive online.")}
                  </div>
                  <div className="projects-tagline-col-3"></div>
                  <div className="projects-tagline-col-4"></div>
                </div>
              )}
            </div>
          ) : activeTab === 'contact' ? (
            <div ref={taglineRef} className="swiss-title-tagline contact-tagline">
              <div className="contact-tagline-columns">
                <div className="contact-tagline-col-1">
                  {wrapWords(getPageTagline(activeTab, selectedClient))}
                </div>
                <div className="contact-tagline-col-2">
                  <div className="social-links">
                    <a href="https://www.instagram.com/sidewalk.co.nz/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.646-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.646-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61581022527859" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="contact-tagline-col-3">
                  <a href="mailto:admin@sidewalks.co.nz" className="contact-email-link">
                    {wrapWords('admin@sidewalks.co.nz')}
                  </a>
                  <br />
                  {wrapWords('nelson, new zealand')}
                </div>
                <div className="contact-tagline-col-4">
                  <form ref={contactFormFieldsRef} className="contact-form-fields" onSubmit={handleContactSubmit}>
                    <div className="contact-form-field">
                      <input 
                        type="text" 
                        placeholder="name" 
                        className="contact-input" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="contact-form-field">
                      <input 
                        type="email" 
                        placeholder="email" 
                        className="contact-input" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="contact-form-field">
                      <textarea 
                        placeholder="message" 
                        className="contact-textarea" 
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="contact-submit-btn" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'sending...' : submitStatus === 'success' ? 'sent!' : 'send'}
                    </button>
                    {submitStatus === 'error' && (
                      <div className="contact-form-error">error sending message. please try again.</div>
                    )}
                  </form>
                </div>
              </div>
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
