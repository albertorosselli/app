import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  onScrollToWork?: () => void
  onScrollToContact: () => void
  copy: any
}

export default function Hero({ onScrollToWork: _onScrollToWork = () => {}, onScrollToContact, copy }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const topLeftRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal animation
      const tl = gsap.timeline({ delay: 0.3 })
      
      tl.fromTo(topLeftRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(headlineRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
        '-=0.4'
      )
      .fromTo(subtextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      )
      
      // Scroll-driven parallax
      gsap.to(headlineRef.current, {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onEnterBack: () => gsap.to(headlineRef.current, { opacity: 1, yPercent: 0, duration: 0.2, overwrite: true }),
        }
      })
      
      gsap.to(subtextRef.current, {
        yPercent: -20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
          onEnterBack: () => gsap.to(subtextRef.current, { opacity: 1, yPercent: 0, duration: 0.2, overwrite: true }),
        }
      })
      
      gsap.to(ctaRef.current, {
        yPercent: -15,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 1,
          onEnterBack: () => gsap.to(ctaRef.current, { opacity: 1, yPercent: 0, duration: 0.2, overwrite: true }),
        }
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      className="section-pinned flex items-center justify-center relative"
      style={{ zIndex: 10 }}
    >
      {/* Top Left Label */}
      <div ref={topLeftRef} />
      
      {/* Main Content */}
      <div className="text-center px-6 max-w-6xl mx-auto">
        <h1 
          ref={headlineRef}
          className="heading-lg text-white mb-6 glow-text"
        >
          {copy.headline}
          <br />
          <span className="text-gray-500 opacity-80 font-normal">{copy.subhead}</span>
        </h1>
        
        <p 
          ref={subtextRef}
          className="text-body max-w-xl mx-auto mb-12"
        >
          {copy.body}
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onScrollToContact}
            className="magnetic-button group px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            {copy.primaryCta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onScrollToContact}
            className="magnetic-button px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
          >
            {copy.secondaryCta}
          </button>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <div 
        ref={scrollHintRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-gray-500 uppercase">
          Bla for å utforske
        </span>
        <div className="scroll-hint">
          <ArrowDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </section>
  )
}
