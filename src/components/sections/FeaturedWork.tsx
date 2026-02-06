import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface Project {
  id: number
  name: string
  category: string
  description: string
  outcome: string
  color: string
  image: string
}

interface WorkCopy {
  sectionLabel: string
  heading: string
  projects: Project[]
}

export default function FeaturedWork({ copy }: { copy: WorkCopy }) {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
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
      
      // Cards stagger animation
      const cards = cardsContainerRef.current?.querySelectorAll('.project-card')
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return (
    <section 
      ref={sectionRef}
      className="section-flowing py-24 md:py-32 relative"
      style={{ zIndex: 30 }}
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div ref={headingRef} className="mb-16 md:mb-24">
          <span className="text-xs tracking-widest text-gray-500 uppercase mb-4 block">
            {copy.sectionLabel}
          </span>
          <h2 className="heading-lg text-white">
            {copy.heading}
          </h2>
        </div>
        
        {/* Projects Grid */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {copy.projects.map((project) => (
            <div
              key={project.id}
              className="project-card group cursor-pointer"
              onMouseEnter={() => setHoveredCard(project.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="project-card-inner relative overflow-hidden rounded-2xl bg-white/5">
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div 
                    className={`flex items-center justify-between transition-all duration-300 ${
                      hoveredCard === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <span className="text-xs text-white/70">
                      {project.outcome}
                    </span>
                    <button className="flex items-center gap-2 text-white text-sm font-medium hover:underline">
                      Open Case Study
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Hover Border Effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
                    hoveredCard === project.id ? 'border-white/30' : 'border-transparent'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors group">
            <span className="text-sm tracking-wider uppercase">View All Projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
