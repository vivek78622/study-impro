"use client"

import { useRef, useEffect, useCallback } from 'react'

interface Dot {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
}

interface InteractiveDotsProps {
  className?: string
  dotColor?: string
  activeDotColor?: string
  dotSize?: number
  spacing?: number
  maxDistance?: number
}

export function InteractiveDots({
  className = "",
  dotColor = "rgba(255, 255, 255, 0.1)",
  activeDotColor = "rgba(34, 193, 163, 0.6)",
  dotSize = 2,
  spacing = 40,
  maxDistance = 100
}: InteractiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  const createDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = []
    const cols = Math.ceil(width / spacing)
    const rows = Math.ceil(height / spacing)
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing + spacing / 2
        const y = j * spacing + spacing / 2
        dots.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0
        })
      }
    }
    
    dotsRef.current = dots
  }, [spacing])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const { x: mouseX, y: mouseY } = mouseRef.current

    dotsRef.current.forEach(dot => {
      const dx = mouseX - dot.baseX
      const dy = mouseY - dot.baseY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance
        const angle = Math.atan2(dy, dx)
        dot.vx += Math.cos(angle) * force * 0.3
        dot.vy += Math.sin(angle) * force * 0.3
      }

      // Apply spring back to original position
      dot.vx += (dot.baseX - dot.x) * 0.05
      dot.vy += (dot.baseY - dot.y) * 0.05

      // Apply damping
      dot.vx *= 0.8
      dot.vy *= 0.8

      // Update position
      dot.x += dot.vx
      dot.y += dot.vy

      // Calculate color based on distance from mouse
      const distanceFromMouse = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2)
      const colorIntensity = Math.max(0, 1 - distanceFromMouse / maxDistance)
      
      if (colorIntensity > 0) {
        ctx.fillStyle = activeDotColor.replace(/[\d.]+\)$/, `${colorIntensity * 0.8})`)
      } else {
        ctx.fillStyle = dotColor
      }

      ctx.beginPath()
      ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [dotColor, activeDotColor, dotSize, maxDistance])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
      
      createDots(rect.width, rect.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    resizeCanvas()
    animate()

    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createDots, animate])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}