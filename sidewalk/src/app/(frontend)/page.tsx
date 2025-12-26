'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import './styles.css'

type Tab = 'home' | 'about' | 'skills' | 'projects' | 'contact'

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: 'home', label: 'Home', color: '#F3ECE3' }, // cream
  { id: 'about', label: 'About', color: '#B74831' }, // red
  { id: 'skills', label: 'Skills', color: '#D7B350' }, // yellow
  { id: 'projects', label: 'Projects', color: '#1C2830' }, // brand color
  { id: 'contact', label: 'Contact', color: '#F3ECE3' }, // cream
]

const getPageTitle = (tab: Tab): string => {
  switch (tab) {
    case 'home':
      return 'web solutions'
    case 'about':
      return 'about'
    case 'skills':
      return 'skills'
    case 'projects':
      return 'projects'
    case 'contact':
      return 'contact'
    default:
      return 'web solutions'
  }
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs for animated elements
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]

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

    // Tab-specific animations
    if (tab === 'about') {
      animateAboutSection(tl)
    } else if (tab === 'skills') {
      animateSkillsSection(tl)
    } else if (tab === 'projects') {
      animateProjectsSection(tl)
    } else if (tab === 'contact') {
      animateContactSection(tl)
    }

    timelineRef.current = tl
  }

  const animateAboutSection = (tl: gsap.core.Timeline) => {
    const stats = contentRef.current?.querySelectorAll('.stat')
    if (!stats || stats.length === 0) return

    // Animate stats with stagger
    gsap.set(stats, {
      opacity: 0,
      y: 30,
      scale: 0.9,
    })

    tl.to(stats, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.4)',
    }, '-=0.2')
  }

  const animateSkillsSection = (tl: gsap.core.Timeline) => {
    const skillCards = contentRef.current?.querySelectorAll('.skill-card')
    if (!skillCards || skillCards.length === 0) return

    gsap.set(skillCards, {
      opacity: 0,
      y: 50,
      rotationX: -15,
    })

    tl.to(skillCards, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power3.out',
    }, '-=0.2')
  }

  const animateProjectsSection = (tl: gsap.core.Timeline) => {
    const projectCards = contentRef.current?.querySelectorAll('.project-card')
    if (!projectCards || projectCards.length === 0) return

    gsap.set(projectCards, {
      opacity: 0,
      scale: 0.8,
      y: 40,
    })

    tl.to(projectCards, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.3)',
    }, '-=0.2')
  }

  const animateContactSection = (tl: gsap.core.Timeline) => {
    const formElements = contentRef.current?.querySelectorAll('.contact-form > *')
    if (!formElements || formElements.length === 0) return

    gsap.set(formElements, {
      opacity: 0,
      x: -30,
    })

    tl.to(formElements, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.2')
  }

  // Animate tab changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready after React render
    const rafId = requestAnimationFrame(() => {
      if (contentRef.current) {
        animateContentIn(activeTab)
      }
    })

    // Cleanup on unmount or before next animation
    return () => {
      cancelAnimationFrame(rafId)
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [activeTab])

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
        <Image src="/logo1.svg" alt="sidewalk" width={120} height={40} />
      </div>

      {/* Swiss Typography Title */}
      <div className={`swiss-title ${activeTab === 'projects' ? 'swiss-title-dark' : ''}`}>
        <div className="swiss-title-top">SIDEWALK</div>
        <div className="swiss-title-middle">{getPageTitle(activeTab)}</div>
        <div className="swiss-title-bottom">SIDEWALK</div>
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
            <span className="section-label">about us</span>
            <h2 className="section-title">small team, big impact</h2>
            <div className="about-text">
              <p>
                we're a nelson-based duo passionate about crafting websites and building brands that connect. 
                at sidewalk, we bring design and development together to help companies stand out online.
              </p>
              <p>
                we believe in self-hosting solutions that give you complete control over your digital presence, 
                and we're committed to building tools that improve business workflow and empower companies to work more efficiently.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">2</div>
                <div className="stat-label">team members</div>
              </div>
              <div className="stat">
                <div className="stat-number">2+</div>
                <div className="stat-label">projects completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">self-hosted</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div ref={contentRef} className="tab-content skills-content">
            <span className="section-label">our expertise</span>
            <h2 className="section-title">technologies we master</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="skill-name">next.js</h3>
                <p className="skill-description">
                  react framework for production. server-side rendering, static generation, 
                  and api routes for modern web applications.
                </p>
              </div>
              <div className="skill-card">
                <div className="skill-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h3 className="skill-name">payload cms</h3>
                <p className="skill-description">
                  headless cms built with typescript. self-hosted, developer-friendly, 
                  and fully customizable content management.
                </p>
              </div>
              <div className="skill-card">
                <div className="skill-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                  </svg>
                </div>
                <h3 className="skill-name">postgresql</h3>
                <p className="skill-description">
                  powerful, open-source relational database. robust, reliable, and perfect 
                  for complex data requirements.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div ref={contentRef} className="tab-content projects-content">
            <span className="section-label">portfolio</span>
            <h2 className="section-title">recent projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-image">
                  <div className="project-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">project one</h3>
                  <p className="project-description">
                    a modern web application built with next.js and payload cms. 
                    featuring custom integrations and a beautiful user interface.
                  </p>
                  <div className="project-tags">
                    <span className="tag">next.js</span>
                    <span className="tag">payload</span>
                    <span className="tag">postgresql</span>
                  </div>
                </div>
              </div>
              <div className="project-card">
                <div className="project-image">
                  <div className="project-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">project two</h3>
                  <p className="project-description">
                    an enterprise solution with advanced features and seamless user experience. 
                    fully self-hosted with custom deployment pipeline.
                  </p>
                  <div className="project-tags">
                    <span className="tag">next.js</span>
                    <span className="tag">payload</span>
                    <span className="tag">postgresql</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div ref={contentRef} className="tab-content contact-content">
            <span className="section-label">get in touch</span>
            <h2 className="section-title">let's build something together</h2>
            <div className="contact-wrapper">
              <div className="contact-info">
                <p>
                  ready to start your next project? we'd love to hear from you. 
                  whether you need a new website, a custom web application, or 
                  help with your existing platform, we're here to help.
                </p>
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">email</div>
                      <div className="contact-value">admin@sidewalks.co.nz</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <div className="contact-label">location</div>
                      <div className="contact-value">nelson, new zealand</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-form-wrapper">
                <form className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">message</label>
                    <textarea id="message" name="message" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">send message</button>
                </form>
              </div>
            </div>
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
