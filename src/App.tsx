import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

// Components
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import FluidBackground from './components/webgl/FluidBackground'
import FloatingLanguageSwitch from './components/FloatingLanguageSwitch'

// Sections
import Hero from './components/sections/Hero'
import WhoIAm from './components/sections/WhoIAm'
import FeaturedWork from './components/sections/FeaturedWork'
import Process from './components/sections/Process'
import Proof from './components/sections/Proof'
import Contact from './components/sections/Contact'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [lang, setLang] = useState<'no' | 'en'>(
    (localStorage.getItem('lang') as 'no' | 'en') || 'no'
  )
  const mainRef = useRef<HTMLElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  
  // Section refs for navigation
  const workRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const proofRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  
  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isLoading) return
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    
    lenisRef.current = lenis
    
    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)
    
    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [isLoading])
  
  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
    // Refresh ScrollTrigger after loading
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }, [])

  const translations = useMemo(() => {
    const data = {
      no: {
        nav: {
          logo: 'Web-Klar',
          items: [
            { label: 'Dette får du', section: 'proof' },
            { label: 'Hva vi gjør', section: 'work' },
            { label: 'Slik går det videre', section: 'process' },
            { label: 'Kontakt', section: 'contact' },
          ],
          cta: 'Få gratis Google-sjekk',
        },
        hero: {
          headline: 'Web-Klar for små bedrifter',
          subhead: 'Enkel nettside og Google-oppsett',
          body: 'En enkel nettside og Google-oppsett som gjør at kunder finner deg og tar kontakt. For deg som driver alene eller er en liten bedrift.',
          primaryCta: 'Få gratis Google-sjekk',
          secondaryCta: 'Kontakt',
        },
        who: {
          heading: 'Dette er for deg som',
          body: 'Du trenger ikke «markedsføring». Du trenger å være synlig når folk søker. Web-Klar er laget for små bedrifter som vil bli funnet uten annonser og uten å bruke tid på teknisk tull.',
          bullets: [
            'Jobber alene eller med få ansatte',
            'Lever av lokale kunder',
            'Vil bli funnet på Google uten annonser',
            'Vil slippe tid på nettsider og teknisk tull',
          ],
        },
        work: {
          sectionLabel: 'Del 02',
          heading: 'Hva Web-Klar gjør',
          projects: [
            {
              id: 1,
              name: 'Du dukker opp på Google',
              category: 'Synlighet',
              description: 'Riktig satt opp Google Bedriftsprofil og kobling til nettsiden.',
              outcome: 'Grunnmur for lokal ranking',
              color: '#10b981',
              image: '/images/Googleklar.png?v=2',
            },
            {
              id: 2,
              name: 'Kunden forstår med én gang',
              category: 'Klarhet',
              description: 'Tydelig tekst og struktur som sier hva du gjør og hvor du gjør det.',
              outcome: 'Færre klikk, mer tillit',
              color: '#0ea5e9',
              image: '/images/Customer.png?v=2',
            },
            {
              id: 3,
              name: 'Kunden tar kontakt',
              category: 'Handling',
              description: 'Synlig telefon, skjema og meldinger som faktisk blir brukt.',
              outcome: 'Flere henvendelser uten annonser',
              color: '#22c55e',
              image: '/images/Contact.png?v=2',
            },
          ],
        },
        process: {
          sectionLabel: 'Del 03',
          heading: 'Slik går det videre',
          steps: [
            { number: '01', title: 'Be om gratis Google-sjekk', description: 'Du sender inn på 2 minutter. Ingen binding.' },
            { number: '02', title: 'Du får en ærlig vurdering', description: 'Jeg viser hva som mangler, hva som er feil og hva som bør gjøres først.' },
            { number: '03', title: 'Vil du videre, setter jeg opp alt', description: 'Nettside, Google Bedriftsprofil og koblingen mellom dem.' },
            { number: '04', title: 'Du fokuserer på jobben din', description: 'Jeg tar det tekniske, du tar telefonen.' },
          ],
        },
        proof: {
          sectionLabel: 'Del 04',
          heading: 'Dette får du',
          benefits: [
            { title: 'Enkel, rask nettside', description: 'Tilpasset mobil med tydelige kontaktpunkter.' },
            { title: 'Google bedriftsprofil', description: 'Satt opp riktig med riktige kategorier, åpningstider og sporing.' },
            { title: 'Riktig kobling mellom Google og nettsiden', description: 'Konsistente data gir bedre synlighet og trygghet.' },
            { title: 'Lokal synlighet', description: 'Optimalisert for ditt område og dine tjenester.' },
          ],
          logos: ['Riktig satt opp', 'Tydelig informasjon', 'Enkel å kontakte'],
          testimonials: [
            { quote: 'Sjekker hvordan bedriften din vises på Google i dag og hva som mangler.', author: 'Gratis Google-sjekk', role: 'Trinn 1', company: 'Ingen forpliktelser', rating: 5 },
            { quote: 'Du får konkrete råd om hva som er enklest å forbedre først.', author: 'Konkrete råd', role: 'Trinn 2', company: 'Praktisk prioritering', rating: 5 },
            { quote: 'Vil du videre, setter jeg opp alt så du kan fokusere på jobben din.', author: 'Gjennomføring', role: 'Trinn 3', company: 'Alt det tekniske håndtert', rating: 5 },
          ],
        },
        contact: {
          headline: 'Gratis Google-sjekk',
          sub: 'Tar 2 minutter. Ingen binding.',
          name: 'Navn',
          email: 'E-post',
          message: 'Hva vil du ha hjelp med?',
          messagePlaceholder: 'Kort om bedriften og hva du ønsker',
          submit: 'Få gratis Google-sjekk',
          submitting: 'Sender...',
          successTitle: 'Takk! Meldingen er sendt.',
          successBody: 'Jeg svarer innen ett arbeidsdøgn.',
          footerLine1: 'Web-Klar',
          footerLine2: 'Enkle nettsider og Google-oppsett for små bedrifter',
          footerLine3: 'IT-ingeniør med over 15 års erfaring',
          footerLine4: 'Basert i Norge — Språk: NO | EN',
          emailLink: 'post@web-klar.no',
        },
      },
      en: {
        nav: {
          logo: 'Web-Klar',
          items: [
            { label: 'What you get', section: 'proof' },
            { label: 'What we do', section: 'work' },
            { label: 'How it works', section: 'process' },
            { label: 'Contact', section: 'contact' },
          ],
          cta: 'Get free Google check',
        },
        hero: {
          headline: 'Web-Klar for small businesses',
          subhead: 'Simple website and Google setup',
          body: 'A simple site and Google setup so customers find you and contact you. For solo operators and small businesses.',
          primaryCta: 'Get free Google check',
          secondaryCta: 'Contact',
        },
        who: {
          heading: 'This is for you who',
          body: 'You do not need “marketing”. You need to be visible when people search. Web-Klar is built for small businesses that want to be found without ads and without spending time on tech.',
          bullets: [
            'Work alone or with a small team',
            'Rely on local customers',
            'Want to be found on Google without ads',
            'Don’t want to spend time on websites and tech hassle',
          ],
        },
        work: {
          sectionLabel: 'Part 02',
          heading: 'What Web-Klar does',
          projects: [
            {
              id: 1,
              name: 'You show up on Google',
              category: 'Visibility',
              description: 'Properly set up Google Business Profile and link to the site.',
              outcome: 'Foundation for local ranking',
              color: '#10b981',
              image: '/images/Googleklar.png?v=2',
            },
            {
              id: 2,
              name: 'Customers understand instantly',
              category: 'Clarity',
              description: 'Clear copy and structure that states what you do and where.',
              outcome: 'Fewer clicks, more trust',
              color: '#0ea5e9',
              image: '/images/Customer.png?v=2',
            },
            {
              id: 3,
              name: 'Customers contact you',
              category: 'Action',
              description: 'Visible phone, form, and messages that actually get used.',
              outcome: 'More inquiries without ads',
              color: '#22c55e',
              image: '/images/Contact.png?v=2',
            },
          ],
        },
        process: {
          sectionLabel: 'Part 03',
          heading: 'How it works',
          steps: [
            { number: '01', title: 'Request free Google check', description: 'Takes 2 minutes. No commitment.' },
            { number: '02', title: 'You get an honest assessment', description: 'I show what’s missing, what’s wrong, and what to fix first.' },
            { number: '03', title: 'If you agree, I set up everything', description: 'Website, Google Business Profile, and the connection between them.' },
            { number: '04', title: 'You focus on your work', description: 'I handle the tech; you answer the calls.' },
          ],
        },
        proof: {
          sectionLabel: 'Part 04',
          heading: 'What you get',
          benefits: [
            { title: 'Simple, fast website', description: 'Mobile-optimized with clear contact points.' },
            { title: 'Google Business Profile', description: 'Set up correctly with categories, hours, and tracking.' },
            { title: 'Right connection between Google and the site', description: 'Consistent data boosts visibility and trust.' },
            { title: 'Local visibility', description: 'Optimized for your area and services.' },
          ],
          logos: ['Properly set up', 'Clear info', 'Easy to contact'],
          testimonials: [
            { quote: 'Review how your business appears on Google today and what’s missing.', author: 'Free Google check', role: 'Step 1', company: 'No obligations', rating: 5 },
            { quote: 'You get concrete advice on the easiest wins first.', author: 'Concrete advice', role: 'Step 2', company: 'Practical priorities', rating: 5 },
            { quote: 'If you proceed, I set it all up so you can focus on the job.', author: 'Execution', role: 'Step 3', company: 'All tech handled', rating: 5 },
          ],
        },
        contact: {
          headline: 'Free Google check',
          sub: 'Takes 2 minutes. No commitment.',
          name: 'Name',
          email: 'Email',
          message: 'What do you need help with?',
          messagePlaceholder: 'Briefly about the business and what you want',
          submit: 'Get free Google check',
          submitting: 'Sending...',
          successTitle: 'Thanks! Message sent.',
          successBody: 'I reply within one business day.',
          footerLine1: 'Web-Klar',
          footerLine2: 'Simple sites and Google setup for small businesses',
          footerLine3: 'IT engineer with 15+ years of experience',
          footerLine4: 'Based in Norway — Languages: NO | EN',
          emailLink: 'post@web-klar.no',
        },
      },
    }
    return data
  }, [])

  const copy = translations[lang]
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])
  
  // Navigation scroll handlers
  const scrollToSection = useCallback((section: string) => {
    const lenis = lenisRef.current
    if (!lenis) return
    
    let target: HTMLElement | null = null
    
    switch (section) {
      case 'work':
        target = workRef.current
        break
      case 'process':
        target = processRef.current
        break
      case 'proof':
        target = proofRef.current
        break
      case 'contact':
        target = contactRef.current
        break
    }
    
    if (target) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    }
  }, [])
  
  const scrollToWork = useCallback(() => {
    scrollToSection('work')
  }, [scrollToSection])
  
  const scrollToContact = useCallback(() => {
    scrollToSection('contact')
  }, [scrollToSection])
  
  // Setup section markers for ScrollTrigger
  useEffect(() => {
    if (isLoading) return
    
    // Refresh ScrollTrigger after all content is loaded
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)
    
    return () => clearTimeout(timeout)
  }, [isLoading])
  
  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {/* Navigation */}
      {!isLoading && <Navigation onScrollToSection={scrollToSection} copy={copy.nav} />}

      {/* Language Switch */}
      {!isLoading && (
        <FloatingLanguageSwitch
          active={lang}
          onChange={(value) => setLang(value)}
        />
      )}
      
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* WebGL Fluid Background */}
      {!isLoading && <FluidBackground intensity={1} />}
      
      {/* Main Content */}
      <main 
        ref={mainRef}
        className={`relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Hero Section */}
        <Hero 
          onScrollToWork={scrollToWork} 
          onScrollToContact={scrollToContact} 
          copy={copy.hero}
        />
        
        {/* Chapter 1: Who I Am */}
        <WhoIAm copy={copy.who} />
        
        {/* Chapter 2: Featured Work */}
        <div ref={workRef}>
          <FeaturedWork copy={copy.work} />
        </div>
        
        {/* Chapter 3: Process */}
        <div ref={processRef}>
          <Process copy={copy.process} />
        </div>
        
        {/* Chapter 4: Proof */}
        <div ref={proofRef}>
          <Proof copy={copy.proof} />
        </div>
        
        {/* Final: Contact */}
        <div ref={contactRef}>
          <Contact copy={copy.contact} />
        </div>
      </main>
    </>
  )
}

export default App
