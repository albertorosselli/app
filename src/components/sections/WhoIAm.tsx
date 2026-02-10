import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface WhoCopy {
  heading: string
  body: string
  bullets: string[]
}

export default function WhoIAm({ copy }: { copy: WhoCopy }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const keywordsRef = useRef<HTMLDivElement>(null)
  const keywordRefs = useRef<(HTMLDivElement | null)[]>([])
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        }
      })
      
      tl.fromTo(headingRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
      )
      .fromTo(bodyRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.6'
      )
      
      // Keywords stagger animation
      keywordRefs.current.forEach((keyword, index) => {
        if (keyword) {
          gsap.fromTo(keyword,
            { opacity: 0, x: 100 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `top ${60 - index * 10}%`,
                end: `top ${40 - index * 10}%`,
                scrub: 1,
              }
            }
          )
        }
      })
      
      // Parallax on scroll
      gsap.to(headingRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      className="section-flowing min-h-screen flex items-center py-24 md:py-32 relative"
      style={{ zIndex: 20 }}
    >
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Heading */}
          <div>
            <h2 
              ref={headingRef}
              className="heading-lg text-white mb-8"
            >
              {copy.heading}
            </h2>
            
            <p 
              ref={bodyRef}
              className="text-body max-w-md"
            >
              {copy.body.replace('Du trenger ikke «markedsføring».', 'Du trenger ikke markedsføring som tar tid.')}
            </p>
          </div>
          
          {/* Right Column - Keywords */}
          <div ref={keywordsRef} className="space-y-6">
            {copy.bullets.map((keyword, index) => (
              <div
                key={keyword}
                ref={el => { keywordRefs.current[index] = el }}
                className="group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm font-mono">
                    0{index + 1}
                  </span>
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight py-1">
                    {keyword}
                  </h3>
                </div>
                <div className="h-px bg-gradient-to-r from-white/20 to-transparent mt-4 ml-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
