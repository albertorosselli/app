import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, Mail, ArrowUpRight, Linkedin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/-alberto-rosselli-/' },
]

interface ContactCopy {
  headline: string
  sub: string
  name: string
  business: string
  website: string
  location: string
  email: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
  successTitle: string
  successBody: string
  footerLine1: string
  footerLine2: string
  footerLine3: string
  footerLine4: string
  emailLink: string
}

export default function Contact({ copy }: { copy: ContactCopy }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLAnchorElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    website: '',
    location: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation with text scramble effect simulation
      gsap.fromTo(headlineRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Email link animation
      gsap.fromTo(emailRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Form animation
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Socials animation
      gsap.fromTo(socialsRef.current?.children || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: socialsRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Footer animation
      gsap.fromTo(footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/submit-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
      setFormData({ name: '', business: '', website: '', location: '', email: '', message: '' })
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  return (
    <section 
      ref={sectionRef}
      className="section-flowing py-24 md:py-32 relative"
      style={{ zIndex: 60 }}
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* Main Headline */}
        <div className="text-center mb-16 md:mb-24">
          <h2 
            ref={headlineRef}
            className="text-3xl md:text-4xl font-semibold text-white max-w-4xl mx-auto leading-tight"
          >
            {copy.headline}
            <br />
            <span className="text-gray-500">{copy.sub}</span>
          </h2>
          
          {/* Email Link */}
          <a 
            ref={emailRef}
            href={`mailto:${copy.emailLink}`}
            className="inline-flex items-center gap-3 mt-6 text-lg md:text-2xl font-medium text-gray-300 hover:text-white transition-colors group"
          >
            <Mail className="w-5 h-5 md:w-6 md:h-6" />
            {copy.emailLink}
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
        
        {/* Contact Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-24"
        >
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{copy.successTitle}</h3>
              <p className="text-gray-500">{copy.successBody}</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    {copy.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  placeholder={copy.name}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                  {copy.business}
                </label>
                <input
                  type="text"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder={copy.business}
                />
              </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    {copy.website}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={copy.website}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    {copy.location}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder={copy.location}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    {copy.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder={copy.email}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    {copy.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder={copy.messagePlaceholder}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {copy.submitting}
                  </>
                ) : (
                  <>
                    {copy.submit}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </form>
        
        {/* Social Links */}
        <div 
          ref={socialsRef}
          className="flex justify-center gap-6 mb-24"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              {social.icon}
            </a>
          ))}
        </div>
        
        {/* Footer */}
        <footer 
          ref={footerRef}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold tracking-tighter text-white">
              Web-Klar
            </div>
            <div className="text-sm text-gray-500">
              Enkle nettsider og Google-oppsett for små bedrifter
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="hover:text-white transition-colors">Laget og drevet av Alberto Rosselli</span>
              <span className="hover:text-white transition-colors">Basert i Norge — Språk: NO | EN</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
