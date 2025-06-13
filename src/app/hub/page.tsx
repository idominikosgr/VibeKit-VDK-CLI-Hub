"use client"

import Link from 'next/link'
import React from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const scaleOnHover = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  }
}

// Enhanced floating elements
const FloatingElements = () => {
  const [mounted, setMounted] = useState(false)
  const [elements, setElements] = useState<Array<{
    size: { width: number, height: number }
    position: { left: string, top: string }
    animation: { x: number[], y: number[] }
    duration: number
  }>>([])
  const [symbols, setSymbols] = useState<Array<{
    position: { left: string, top: string }
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // Generate consistent random values on client mount
    const newElements = Array.from({ length: 6 }).map(() => ({
      size: {
        width: Math.random() * 300 + 200,
        height: Math.random() * 300 + 200,
      },
      position: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      },
      animation: {
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
      },
      duration: Math.random() * 20 + 20,
    }))

    const newSymbols = ['{}', '</>', '()', '[]', '<ai>', '⚡'].map(() => ({
      position: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      },
      duration: Math.random() * 8 + 12,
      delay: Math.random() * 5,
    }))

    setElements(newElements)
    setSymbols(newSymbols)
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none overflow-hidden" />
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated blobs */}
      {elements.map((element, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{
            background: `linear-gradient(45deg, ${
              ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i]
            }, transparent)`,
            width: element.size.width,
            height: element.size.height,
            left: element.position.left,
            top: element.position.top,
          }}
          animate={{
            x: element.animation.x,
            y: element.animation.y,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating code symbols */}
      {['{}', '</>', '()', '[]', '<ai>', '⚡'].map((symbol, i) => (
        <motion.div
          key={`symbol-${i}`}
          className="absolute text-2xl font-mono text-primary/20 dark:text-primary/30"
          style={{
            left: symbols[i]?.position.left || '50%',
            top: symbols[i]?.position.top || '50%',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: symbols[i]?.duration || 12,
            repeat: Infinity,
            delay: symbols[i]?.delay || 0,
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  )
}

// Enhanced interactive code demo with liquid glass effects
const VibeCodeDemo = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  
  const steps = [
    { 
      title: "Project Analysis", 
      code: `🧠 Analyzing your vibe...\n📊 React + TypeScript detected\n🎯 Identifying coding patterns\n✨ Vibe score: IMMACULATE`,
      description: "AI understands your coding style"
    },
    { 
      title: "Smart Matching", 
      code: `🔍 Scanning 108+ expert rules\n🎪 Found 23 vibe-compatible rules\n⚡ Compatibility: 9.8/10\n🚀 Ready to amplify your AI game`,
      description: "Perfect rule matching for your stack"
    },
    { 
      title: "Vibe Generation", 
      code: `📦 Generating your vibe package...\n🔥 Creating .cursorrules\n🎨 Adding personalization\n✅ Your AI assistant is vibing!`,
      description: "One-click deployment to any AI tool"
    },
    { 
      title: "Framework Power", 
      code: `🚀 Want systematic intelligence?\n📡 curl -fsSL cli.vibecodingrules.rocks | sh\n🧠 Context-aware rule generation\n⚡ Enterprise-ready automation`,
      description: "VibeCodingRules framework for teams"
    }
  ]

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div 
      className="relative bg-white/10 dark:bg-gray-950/80 backdrop-blur-xl rounded-3xl p-8 overflow-hidden border border-white/20 dark:border-gray-800/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
      onMouseMove={handleMouseMove}
      style={{
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 2px 8px rgba(255, 255, 255, 0.1)
        `
      }}
    >
      {/* Liquid glass highlight effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 50%)`
        }}
      />
      
      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-3xl" />
      
      {/* Enhanced terminal header with glass effect */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
          </div>
          <div className="text-gray-400 text-sm ml-4 font-mono backdrop-blur-sm">vibe-coding-ai</div>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-md"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Enhanced code content */}
      <div className="relative">
        <motion.div 
          className="font-mono text-green-400 text-sm leading-relaxed min-h-[120px]"
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {steps[activeStep].code.split('\n').map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-2"
            >
                             <span className="text-purple-400">&gt;</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced step indicators */}
        <div className="flex gap-2 mt-8">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                "px-4 py-2 rounded-full text-xs transition-all duration-300 border",
                activeStep === i 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25" 
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border-gray-700"
              )}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced interactive feature card with liquid glass effects
const VibeFeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  demo, 
  delay = 0,
  gradient = "from-primary/10 to-purple-500/10"
}: {
  title: string
  description: string
  icon: any
  demo: React.ReactNode
  delay?: number
  gradient?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden"
    >
      <Card 
        className="relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 dark:border-gray-800/30 transition-all duration-500 hover:scale-[1.02] hover:border-white/50 dark:hover:border-gray-700/50"
        style={{
          boxShadow: `
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 3px rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Liquid glass specular highlight */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
          }}
        />
        
        {/* Adaptive gradient overlay */}
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl", gradient)} />
        
        <CardHeader className="pb-4 relative">
          <motion.div 
            className="w-14 h-14 rounded-3xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 flex items-center justify-center mb-6 group-hover:bg-white/30 dark:group-hover:bg-gray-700/40 transition-all duration-300 shadow-lg"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0 
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: `
                0 8px 16px rgba(0, 0, 0, 0.1),
                inset 0 1px 2px rgba(255, 255, 255, 0.2)
              `
            }}
          >
            <Icon className="h-7 w-7 text-primary drop-shadow-sm" />
          </motion.div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 drop-shadow-sm">{title}</CardTitle>
          <CardDescription className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 relative">
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-md p-4 border border-white/20 dark:border-gray-700/30"
            style={{
              boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.1)`
            }}
          >
            {demo}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced testimonial with liquid glass effects
const VibeTestimonialCard = ({ 
  quote, 
  author, 
  role, 
  avatar,
  vibe = "🔥"
}: {
  quote: string
  author: string
  role: string
  avatar: string
  vibe?: string
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      className="group relative p-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-800/30 hover:border-white/50 dark:hover:border-gray-700/50 transition-all duration-500"
      style={{
        boxShadow: `
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 3px rgba(255, 255, 255, 0.1)
        `
      }}
    >
      {/* Liquid glass specular highlight */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
        }}
      />
      
      <div className="relative">
        <div className="text-2xl mb-4 drop-shadow-sm">{vibe}</div>
        <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg backdrop-blur-sm border border-white/20"
            style={{
              boxShadow: `
                0 8px 16px rgba(0, 0, 0, 0.2),
                inset 0 1px 2px rgba(255, 255, 255, 0.3)
              `
            }}
          >
            {avatar}
          </div>
          <div>
            <div className="font-bold text-base text-gray-900 dark:text-white">{author}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced stats with vibe theming
const VibeAnimatedStat = ({ value, label, prefix = "", suffix = "", icon }: {
  value: number
  label: string
  prefix?: string
  suffix?: string
  icon?: any
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    
    const duration = 2500
    const startTime = Date.now()
    
    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(easeOut * value))
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }
    
    updateCount()
  }, [isInView, value])

  return (
    <motion.div 
      ref={ref} 
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
          whileHover={{ rotate: 5 }}
        >
          {React.createElement(icon, { className: "h-8 w-8 text-primary" })}
        </motion.div>
      )}
      <motion.div 
        className="text-4xl md:text-6xl font-black bg-gradient-to-br from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {prefix}{count}{suffix}
      </motion.div>
      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

export default function MainLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Enhanced full-width background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/50 dark:from-gray-950 dark:via-gray-950/90 dark:to-purple-950/20" />
      
      {/* Enhanced grid pattern - full width */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Floating elements */}
      <FloatingElements />

      <div className="relative">
        {/* Enhanced Hero Section */}
        <motion.section 
          className="relative min-h-screen flex items-center justify-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Badge 
                  variant="outline" 
                  className="mb-8 px-6 py-3 text-base border-primary/30 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-gray-800/40 transition-all duration-300 shadow-lg hover:shadow-xl border dark:border-gray-700/30"
                  style={{
                    boxShadow: `
                      0 8px 16px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      inset 0 1px 2px rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  <Icons.brain className="mr-3 h-4 w-4 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Upgrade Your Agentic AI Game</span>
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.85]"
              >
                Master the art of
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Vibe Coding
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              >
                Transform your AI assistant into a <span className="text-primary font-bold">project-aware coding genius</span> with 
                systematic intelligence. Browse curated expert rules or deploy our automated framework for 
                <span className="text-primary font-bold"> context-aware AI assistance</span>.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-6 pt-12"
              >
                <Link href="/setup">
                  <Button 
                    size="lg" 
                    className="group relative text-xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 overflow-hidden"
                    style={{
                      boxShadow: `
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 3px rgba(255, 255, 255, 0.2)
                      `
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icons.settings className="mr-4 h-6 w-6 relative drop-shadow-sm" />
                    <span className="relative drop-shadow-sm">Start Vibing</span>
                  </Button>
                </Link>
                
                <Link href="/rules">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="group relative text-xl px-12 py-8 border-2 border-white/30 dark:border-gray-700/50 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-gray-800/40 hover:scale-105 transition-all duration-300 hover:border-white/50 dark:hover:border-gray-600/60 overflow-hidden"
                    style={{
                      boxShadow: `
                        0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 3px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icons.code className="mr-4 h-6 w-6 relative drop-shadow-sm" />
                    <span className="relative drop-shadow-sm">See the magic</span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Interactive Demo Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-20 items-center"
            >
              <motion.div variants={fadeInUp} className="space-y-8">
                <Badge variant="outline" className="w-fit px-4 py-2">
                  <Icons.brain className="mr-2 h-4 w-4" />
                  AI Intelligence Engine
                </Badge>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                  From zero to 
                  <span className="text-primary"> AI wizard</span>
                  <br />in minutes
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Our platform reads your coding vibe, understands your stack, and generates 
                  the perfect ruleset that makes your AI assistant work like a senior developer on your team.
                </p>
                <div className="flex gap-6">
                  <Link href="/setup">
                    <Button className="hover:scale-105 transition-transform text-lg px-8 py-4">
                      Try the Vibe Wizard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="hover:scale-105 transition-transform text-lg px-8 py-4">
                    Watch demo
                    <Icons.brain className="ml-3 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <VibeCodeDemo />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-pink-500/10" />
          <div className="max-w-6xl mx-auto relative">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <VibeAnimatedStat value={108} label="Expert Rules" suffix="+" icon={Icons.code} />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <VibeAnimatedStat value={25} label="AI Platforms" suffix="+" icon={Icons.aitools} />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <VibeAnimatedStat value={2} label="Powerful Tools" suffix="" icon={Icons.settings} />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <VibeAnimatedStat value={99} label="Vibe Score" suffix="%" icon={Icons.brain} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* For Developers Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div 
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Badge variant="outline" className="mb-8 px-6 py-3">
                <Icons.settings className="mr-3 h-4 w-4" />
                For Professional Developers
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                Ship production code with
                <span className="text-primary"> AI superpowers</span>
              </h2>
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Enterprise-grade rule sets that turn your AI assistant into a senior developer. 
                Get code reviews, architecture guidance, and best practices automatically.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-3 gap-10">
              <VibeFeatureCard
                title="Enterprise AI Rules"
                description="Production-ready rule sets tested by senior engineers across Fortune 500 companies."
                icon={Icons.settings}
                delay={0}
                gradient="from-blue-500/10 to-cyan-500/10"
                demo={
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Security best practices</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Performance optimization</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium">Architecture patterns</span>
                    </div>
                  </div>
                }
              />
              
              <VibeFeatureCard
                title="Team Collaboration"
                description="Sync rule sets across your team for consistent code quality and shared best practices."
                icon={Icons.git}
                delay={0.1}
                gradient="from-green-500/10 to-emerald-500/10"
                demo={
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team sync status</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "92%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>12/13 developers synced</span>
                      <span>92%</span>
                    </div>
                  </div>
                }
              />
              
              <VibeFeatureCard
                title="CI/CD Integration"
                description="Automated rule deployment with GitHub Actions, GitLab CI, and all major platforms."
                icon={Icons.brain}
                delay={0.2}
                gradient="from-purple-500/10 to-pink-500/10"
                demo={
                  <div className="space-y-3">
                    {['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI'].map((platform, i) => (
                      <motion.div
                        key={platform}
                        className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <span className="text-sm">{platform}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </motion.div>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* For Hobbyists Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div 
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Badge variant="outline" className="mb-8 px-6 py-3">
                <Icons.code className="mr-3 h-4 w-4" />
                For Creative Hobbyists
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                Turn your crazy ideas into
                <span className="text-primary"> beautiful code</span>
              </h2>
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Perfect for weekend warriors, indie hackers, and creative coders. 
                Get AI assistance that understands your experimental style and helps you learn faster.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-3 gap-10">
              <VibeFeatureCard
                title="Learn While Building"
                description="AI rules that explain concepts, suggest improvements, and teach best practices as you code."
                icon={Icons.brain}
                delay={0}
                gradient="from-pink-500/10 to-rose-500/10"
                demo={
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950/20 border-l-4 border-pink-500">
                      <div className="text-xs font-semibold text-pink-800 dark:text-pink-200">💡 Learning Tip</div>
                      <div className="text-sm text-pink-700 dark:text-pink-300">Use const for immutable values</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500">
                      <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">🚀 Optimization</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Consider useMemo for this calculation</div>
                    </div>
                  </div>
                }
              />
              
              <VibeFeatureCard
                title="Creative Freedom"
                description="Flexible rules that adapt to your experimental style without being overly restrictive."
                icon={Icons.aitools}
                delay={0.1}
                gradient="from-orange-500/10 to-yellow-500/10"
                demo={
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Creativity Mode</span>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ✨ Experimental features enabled<br/>
                      🎨 Creative naming allowed<br/>
                      🚀 Fast prototyping mode
                    </div>
                  </div>
                }
              />
              
              <VibeFeatureCard
                title="Project Templates"
                description="Quick-start templates for common hobby projects: games, art, web apps, and experiments."
                icon={Icons.tasks}
                delay={0.2}
                gradient="from-cyan-500/10 to-teal-500/10"
                demo={
                  <div className="grid grid-cols-2 gap-2">
                    {['Game Dev', 'Art Gen', 'Web App', 'Bot'].map((template, i) => (
                      <motion.div
                        key={template}
                        className="p-2 rounded bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 text-center text-xs font-medium"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {template}
                      </motion.div>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* VibeCodingRules CLI Tool Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div 
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Badge variant="outline" className="mb-8 px-6 py-3">
                <Icons.brain className="mr-3 h-4 w-4" />
                The AI Context Framework
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                The Framework That Makes
                <span className="text-primary"> AI Assistants</span>
                <br />Project-Aware
              </h2>
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                <span className="text-primary font-semibold">Stop repeating yourself to your AI assistant.</span> VibeCodingRules 
                provides 51+ specialized task rules, comprehensive language support, and automated setup 
                that transforms any AI assistant into a project-aware coding expert with memory management and cross-session continuity.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold">Context as Code. Intelligence as Structure.</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    VibeCodingRules bridges the gap between generic AI assistance and project-specific intelligence. 
                    Our systematic approach employs advanced static analysis to understand your technology stack, 
                    naming patterns, and project architecture—then automatically generates the context your AI needs 
                    to work like a senior developer on your team.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icons.brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technology Stack Intelligence</h4>
                      <p className="text-muted-foreground">Automatically identifies React, Vue, Django, Next.js, and 50+ frameworks, libraries, and tools in your codebase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icons.code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Architecture Pattern Detection</h4>
                      <p className="text-muted-foreground">Deep analysis of your coding patterns, naming conventions, and project structure to create contextually perfect rules</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Icons.settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Universal AI Compatibility</h4>
                      <p className="text-muted-foreground">Works with Claude, GitHub Copilot, Cursor, Windsurf, VS Code extensions, and any AI coding assistant</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-gray-400 text-sm">Terminal</span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-green-400">$ curl -fsSL https://cli.vibecodingrules.rocks | sh</div>
                    <div className="text-gray-300">🔍 Analyzing project architecture...</div>
                    <div className="text-gray-300">📊 Detected: React + TypeScript + Next.js + Tailwind</div>
                    <div className="text-gray-300">🎯 Mapping component patterns & naming conventions...</div>
                    <div className="text-gray-300">🧠 Processing 847 files across 23 directories...</div>
                    <div className="text-gray-300">⚡ Generating context-aware rule framework...</div>
                    <div className="text-gray-300">📦 Creating .mdc files for optimal AI understanding...</div>
                    <div className="text-emerald-400">✅ Generated 51 intelligent rules in .ai/rules/</div>
                    <div className="text-emerald-400">🚀 AI assistant now understands your project architecture!</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Card className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-800/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                      <Icons.brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle>51+ Specialized Task Rules</CardTitle>
                    <CardDescription>
                      Comprehensive task system including AI Session Handoff, Code Quality Review, 
                      API Documentation, Accessibility Review, and 47+ other specialized behaviors for intelligent coding assistance.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-blue-200 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                      <Icons.code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Memory & Session Continuity</CardTitle>
                    <CardDescription>
                      Advanced memory management and cross-session handoff protocols ensure your AI assistant 
                      maintains project context and coding patterns across development sessions and team collaboration.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-200 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                      <Icons.git className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Multi-Platform Support</CardTitle>
                    <CardDescription>
                      Works seamlessly with Cursor, VS Code, WebStorm, GitHub Copilot, Claude, and any AI assistant. 
                      Interactive setup wizard automatically configures rules for your specific technology stack.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center mt-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800/30">
                <Icons.git className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Ready to revolutionize your AI workflow?</h4>
                  <p className="text-muted-foreground">Get the VibeCodingRules framework and make your AI assistant project-aware in minutes</p>
                </div>
                <Button 
                  variant="outline" 
                  className="ml-4 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  asChild
                >
                  <a href="https://github.com/idominikosgr/Vibe-Coding-Rules" target="_blank" rel="noopener noreferrer">
                    <Icons.git className="mr-2 h-4 w-4" />
                    Get the Framework
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Community Testimonials */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-transparent dark:via-gray-900/40" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div 
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Badge variant="outline" className="mb-8 px-6 py-3">
                <Icons.git className="mr-3 h-4 w-4" />
                Vibe Coding Community
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                Developers are 
                <span className="text-primary"> vibing</span> worldwide
              </h2>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <VibeTestimonialCard
                  quote="This changed everything. My AI went from suggesting basic fixes to architecting entire features. The vibe is immaculate."
                  author="Sarah Chen"
                  role="Senior Full-Stack Developer"
                  avatar="SC"
                  vibe="🔥"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <VibeTestimonialCard
                  quote="Finally, an AI that gets my coding style! It's like having a senior dev who actually understands the vibe."
                  author="Mike Rodriguez"
                  role="Indie Game Developer"
                  avatar="MR"
                  vibe="🚀"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <VibeTestimonialCard
                  quote="From prototype to production in record time. The AI rules made my weekend projects actually ship-worthy."
                  author="Emily Park"
                  role="Creative Technologist"
                  avatar="EP"
                  vibe="✨"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-10"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-8 px-6 py-3 text-lg">
                  <Icons.brain className="mr-3 h-5 w-5" />
                  Ready to Upgrade Your AI Game?
                </Badge>
              </motion.div>
              
              <motion.h2 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-black tracking-tight"
              >
                Start your 
                <span className="text-primary"> vibe coding</span>
                <br />journey today
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp}
                className="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              >
                Join thousands of developers who've already upgraded their AI assistants. 
                From weekend projects to production apps, we've got the perfect vibe for your code.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-8 pt-12"
              >
                <Link href="/setup">
                  <Button 
                    size="lg" 
                    className="group relative text-2xl px-16 py-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20 overflow-hidden"
                    style={{
                      boxShadow: `
                        0 25px 50px -12px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 3px rgba(255, 255, 255, 0.2)
                      `
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icons.settings className="mr-4 h-7 w-7 relative drop-shadow-sm" />
                    <span className="relative drop-shadow-sm">Start Vibing Now</span>
                  </Button>
                </Link>
                
                <Link href="/rules">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="group relative text-2xl px-16 py-10 border-2 border-white/30 dark:border-gray-700/50 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-gray-800/40 hover:scale-110 transition-all duration-300 hover:border-white/50 dark:hover:border-gray-600/60 overflow-hidden"
                    style={{
                      boxShadow: `
                        0 20px 25px -5px rgba(0, 0, 0, 0.1),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 3px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icons.code className="mr-4 h-7 w-7 relative drop-shadow-sm" />
                    <span className="relative drop-shadow-sm">Explore the Vibes</span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}