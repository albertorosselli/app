import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  onScrollToSection: (section: string) => void
  copy: {
    logo: string
    items: { label: string; section: string }[]
    cta: string
  }
}

export default function Navigation({ onScrollToSection, copy }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.8
      
      // Show nav after scrolling past hero
      if (currentScrollY > heroHeight) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  }, [isVisible])
  
  const handleNavClick = (section: string) => {
    onScrollToSection(section)
    setIsMobileOpen(false)
  }
  
  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] opacity-0 -translate-y-full"
      >
        <div className="mx-4 md:mx-8 mt-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-4 flex items-center justify-between border border-white/10">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity"
            >
              {copy.logo}
            </button>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {copy.items.map((item) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className="nav-link text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* CTA Button */}
            <button 
              onClick={() => handleNavClick('contact')}
              className="hidden md:block px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              {copy.cta}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[99] bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {copy.items.map((item, index) => (
            <button
              key={item.section}
              onClick={() => handleNavClick(item.section)}
              className="text-3xl font-bold text-white hover:text-gray-300 transition-colors"
              style={{
                transitionDelay: isMobileOpen ? `${index * 50}ms` : '0ms',
                transform: isMobileOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact')}
            className="mt-8 px-8 py-4 bg-white text-black font-medium rounded-full"
            style={{
              transitionDelay: isMobileOpen ? '200ms' : '0ms',
              transform: isMobileOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileOpen ? 1 : 0,
            }}
          >
            {copy.cta}
          </button>
        </div>
      </div>
    </>
  )
}
