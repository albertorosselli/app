import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, Palette, Code, Rocket } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface ProcessStep {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

interface ProcessCopy {
  sectionLabel: string
  heading: string
  steps: Omit<ProcessStep, 'icon'>[]
}

export default function Process({ copy }: { copy: ProcessCopy }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  
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
      
      // Line draw animation
      if (lineRef.current) {
        const lineLength = lineRef.current.getTotalLength()
        gsap.set(lineRef.current, {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength
        })
        
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          }
        })
      }
      
      // Steps animation
      stepRefs.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(step,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      className="section-flowing py-24 md:py-32 relative section-light"
      style={{ zIndex: 40 }}
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div ref={headingRef} className="mb-16 md:mb-24 text-center">
          <span className="text-xs tracking-widest text-gray-500 uppercase mb-4 block">
            {copy.sectionLabel}
          </span>
          <h2 className="heading-lg text-gray-900">
            {copy.heading}
          </h2>
        </div>
        
        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line - Desktop */}
          <svg 
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 hidden lg:block"
            style={{ overflow: 'visible' }}
          >
            <line
              ref={lineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#111"
              strokeWidth="2"
            />
          </svg>
          
          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {copy.steps.map((step, index) => (
              <div
                key={step.number}
                ref={el => { stepRefs.current[index] = el }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-2 lg:text-left' : 'lg:text-right'}`}>
                  <div className={`flex items-center gap-4 mb-4 ${index % 2 === 1 ? 'lg:justify-start' : 'lg:justify-end'}`}>
                    <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                      {index === 0 ? <Search className="w-6 h-6" /> : index === 1 ? <Palette className="w-6 h-6" /> : index === 2 ? <Code className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                    </div>
                    <span className="text-6xl md:text-8xl font-bold text-gray-200">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>
                
                {/* Spacer for alternating layout */}
                <div className={`hidden lg:block ${index % 2 === 1 ? 'lg:order-1' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
