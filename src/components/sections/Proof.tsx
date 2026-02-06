import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Benefit {
  title: string
  description: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  rating: number
}

interface ProofCopy {
  sectionLabel: string
  heading: string
  benefits: Benefit[]
  testimonials: Testimonial[]
  logos: string[]
}

export default function Proof({ copy }: { copy: ProofCopy }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const logosRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Metrics animation
      gsap.fromTo(metricsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: metricsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Testimonials animation
      gsap.fromTo(testimonialsRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
      
      // Logos animation
      gsap.fromTo(logosRef.current?.children || [],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      className="section-flowing py-24 md:py-32 relative"
      style={{ zIndex: 50 }}
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div ref={headingRef} className="mb-16 md:mb-24 text-center">
          <span className="text-xs tracking-widest text-gray-500 uppercase mb-4 block">
            {copy.sectionLabel}
          </span>
          <h2 className="heading-lg text-white">
            {copy.heading}
          </h2>
        </div>
        
        {/* Benefits */}
        <div 
          ref={metricsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
        >
          {copy.benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-lg font-semibold text-white mb-2">
                {benefit.title}
              </div>
              <div className="text-sm text-gray-200">
                {benefit.description}
              </div>
            </div>
          ))}
        </div>
        
        {/* Why this works */}
        <div 
          ref={logosRef}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-24 opacity-70"
        >
          {copy.logos.map((logo) => (
            <span 
              key={logo}
              className="text-2xl md:text-3xl font-bold text-gray-600 tracking-tight"
            >
              {logo}
            </span>
          ))}
        </div>
        
        {/* Gratis Google-sjekk */}
        <div 
          ref={testimonialsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {copy.testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-colors"
            >
              <Quote className="w-8 h-8 text-gray-600 mb-4" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              <div>
                <div className="font-medium text-white">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
