import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Simulate loading progress
    const duration = 2000
    const interval = 20
    const steps = duration / interval
    let currentStep = 0
    
    const timer = setInterval(() => {
      currentStep++
      const easedProgress = 1 - Math.pow(1 - currentStep / steps, 3) // Ease out cubic
      setProgress(Math.min(Math.floor(easedProgress * 100), 100))
      
      if (currentStep >= steps) {
        clearInterval(timer)
        
        // Exit animation
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete()
          }
        })
        
        tl.to(textRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in'
        })
        .to(progressRef.current, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.4,
          ease: 'power2.in'
        }, '-=0.2')
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'expo.inOut'
        })
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [onComplete])
  
  return (
    <div 
      ref={containerRef}
      className="loading-screen"
    >
      <div ref={textRef} className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          Web-Klar
        </h1>
        <p className="text-sm text-gray-500 tracking-widest uppercase">
          Laster
        </p>
      </div>
      
      <div ref={progressRef} className="loading-bar">
        <div 
          className="loading-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-4 text-white font-mono text-sm">
        {progress}%
      </div>
    </div>
  )
}
