import React from 'react'
import Image from 'next/image'
import './styles.css'

export default function HomePage() {
  return (
    <div className="website">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <Image src="/logo1.svg" alt="Sidewalk" width={120} height={40} />
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <svg className="nav-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 Q360,0 720,30 T1440,30 L1440,60 L0,60 Z" fill="var(--color-bg)"/>
          <path d="M0,30 Q360,0 720,30 T1440,30" fill="none" stroke="var(--color-dark)" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Web Solutions Company</div>
          <h1 className="hero-title">
            Building Modern
            <span className="highlight"> Web Experiences</span>
          </h1>
          <p className="hero-description">
            We specialize in Next.js, Payload CMS, and PostgreSQL. 
            Self-hosted solutions crafted with precision and care.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">View Our Work</a>
            <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">About Us</span>
            <h2 className="section-title">Small Team, Big Impact</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                We're a two-person team passionate about creating exceptional web solutions. 
                Our focus is on building fast, scalable, and maintainable applications using 
                cutting-edge technologies.
              </p>
              <p>
                We believe in self-hosting our solutions, giving you complete control and 
                ownership of your digital presence. Every project is crafted with attention 
                to detail and a commitment to excellence.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">2</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat">
                <div className="stat-number">2+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Self-Hosted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Expertise</span>
            <h2 className="section-title">Technologies We Master</h2>
          </div>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="skill-name">Next.js</h3>
              <p className="skill-description">
                React framework for production. Server-side rendering, static generation, 
                and API routes for modern web applications.
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
              <h3 className="skill-name">Payload CMS</h3>
              <p className="skill-description">
                Headless CMS built with TypeScript. Self-hosted, developer-friendly, 
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
              <h3 className="skill-name">PostgreSQL</h3>
              <p className="skill-description">
                Powerful, open-source relational database. Robust, reliable, and perfect 
                for complex data requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Recent Projects</h2>
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
                <h3 className="project-title">Project One</h3>
                <p className="project-description">
                  A modern web application built with Next.js and Payload CMS. 
                  Featuring custom integrations and a beautiful user interface.
                </p>
                <div className="project-tags">
                  <span className="tag">Next.js</span>
                  <span className="tag">Payload</span>
                  <span className="tag">PostgreSQL</span>
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
                <h3 className="project-title">Project Two</h3>
                <p className="project-description">
                  An enterprise solution with advanced features and seamless user experience. 
                  Fully self-hosted with custom deployment pipeline.
                </p>
                <div className="project-tags">
                  <span className="tag">Next.js</span>
                  <span className="tag">Payload</span>
                  <span className="tag">PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Let's Build Something Together</h2>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <p>
                Ready to start your next project? We'd love to hear from you. 
                Whether you need a new website, a custom web application, or 
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
                    <div className="contact-label">Email</div>
                    <div className="contact-value">hello@sidewalk.dev</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">Available upon request</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-wrapper">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">Sidewalk</div>
              <p>Web solutions crafted with care</p>
            </div>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Sidewalk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
