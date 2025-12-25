'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import './styles.css'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="website">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <Image src="/logo1.svg" alt="sidewalk" width={120} height={40} />
          </div>
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#about" onClick={closeMenu}>about</a>
            <a href="#skills" onClick={closeMenu}>skills</a>
            <a href="#projects" onClick={closeMenu}>projects</a>
            <a href="#contact" onClick={closeMenu}>contact</a>
          </div>
        </div>
        <svg className="nav-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <g className="wave-path">
            <path d="M-2880,30 Q-2520,0 -2160,30 T-1440,30 Q-1080,0 -720,30 T0,30 Q360,0 720,30 T1440,30 Q1800,0 2160,30 T2880,30 Q3240,0 3600,30 T4320,30 L4320,60 L-2880,60 Z" fill="var(--color-bg)">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0,0"
                to="1440,0"
                dur="8s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path d="M-2880,30 Q-2520,0 -2160,30 T-1440,30 Q-1080,0 -720,30 T0,30 Q360,0 720,30 T1440,30 Q1800,0 2160,30 T2880,30 Q3240,0 3600,30 T4320,30" fill="none" stroke="url(#curveGradient)" strokeWidth="17" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0,0"
                to="1440,0"
                dur="8s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
          </g>
        </svg>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            craft digital
            <span className="highlight"> experiences</span>
          </h1>
          <p className="hero-description">
            we specialize in next.js, payload cms, and postgresql. 
            self-hosted solutions crafted with precision and care.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">view our work</a>
            <a href="#contact" className="btn btn-secondary">get in touch</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* Hero/About Divider */}
      <div className="hero-divider">
        <svg className="divider-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 1440 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <path d="M0,0 Q360,60 720,30 T1440,30 L1440,60 L0,60 Z" fill="var(--color-dark)"/>
          <path d="M0,0 Q360,60 720,30 T1440,30" fill="none" stroke="url(#dividerGradient)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">about us</span>
            <h2 className="section-title">small team, big impact</h2>
          </div>
          <div className="about-content">
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
        </div>
      </section>

      {/* About/Skills Divider */}
      <div className="section-divider">
        <svg className="divider-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 1440 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sectionDividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <path d="M0,0 Q360,60 720,30 T1440,30 L1440,90 L0,90 Z" fill="var(--color-bg)"/>
          <path d="M0,0 Q360,60 720,30 T1440,30" fill="none" stroke="url(#sectionDividerGradient)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <div className="section-header">
            <span className="section-label">our expertise</span>
            <h2 className="section-title">technologies we master</h2>
          </div>
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
      </section>

      {/* Skills/Projects Divider */}
      <div className="section-divider section-divider-light">
        <svg className="divider-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 1440 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skillsProjectsDividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <path d="M0,0 Q360,60 720,30 T1440,30 L1440,90 L0,90 Z" fill="var(--color-dark)"/>
          <path d="M0,0 Q360,60 720,30 T1440,30" fill="none" stroke="url(#skillsProjectsDividerGradient)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <span className="section-label">portfolio</span>
            <h2 className="section-title">recent projects</h2>
          </div>
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
      </section>

      {/* Projects/Contact Divider */}
      <div className="section-divider section-divider-dark">
        <svg className="divider-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 1440 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="projectsContactDividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <path d="M0,0 Q360,60 720,30 T1440,30 L1440,90 L0,90 Z" fill="var(--color-bg)"/>
          <path d="M0,0 Q360,60 720,30 T1440,30" fill="none" stroke="url(#projectsContactDividerGradient)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-label">get in touch</span>
            <h2 className="section-title">let's build something together</h2>
          </div>
          <div className="contact-content">
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
      </section>

      {/* Contact/Footer Divider */}
      <div className="section-divider section-divider-light">
        <svg className="divider-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 1440 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="contactFooterDividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="100%;200%;100%" dur="3s" repeatCount="indefinite"/>
              <stop offset="0%" stopColor="#B74831">
                <animate attributeName="stopColor" values="#B74831;#D7B350;#B74831" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#D7B350">
                <animate attributeName="stopColor" values="#D7B350;#B74831;#D7B350" dur="3s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <path d="M0,0 Q360,60 720,30 T1440,30 L1440,90 L0,90 Z" fill="var(--color-dark)"/>
          <path d="M0,0 Q360,60 720,30 T1440,30" fill="none" stroke="url(#contactFooterDividerGradient)" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-text">sidewalk</div>
        </div>
      </footer>
    </div>
  )
}
