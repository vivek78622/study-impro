"use client"

import { useEffect, useRef } from 'react'

interface LightRaysProps {
  raysOrigin?: 'top-center' | 'center' | 'bottom-center'
  raysColor?: string
  raysSpeed?: number
  lightSpread?: number
  rayLength?: number
  pulsating?: boolean
  fadeDistance?: number
  saturation?: number
  followMouse?: boolean
  mouseInfluence?: number
  noiseAmount?: number
  distortion?: number
  className?: string
}

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#B8B8FF',
  raysSpeed = 0.6,
  lightSpread = 0.75,
  rayLength = 0.9,
  pulsating = false,
  fadeDistance = 0.85,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.06,
  noiseAmount = 0.04,
  distortion = 0.02,
  className = ''
}: LightRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const rays: Array<{ angle: number; length: number; opacity: number }> = []

    // Initialize rays
    for (let i = 0; i < 12; i++) {
      rays.push({
        angle: (i / 12) * Math.PI * 2,
        length: Math.random() * rayLength + 0.3,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * Math.min(window.devicePixelRatio, 2)
      canvas.height = rect.height * Math.min(window.devicePixelRatio, 2)
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2))
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX / rect.width
      mouseRef.current.y = e.clientY / rect.height
    }

    const animate = () => {
      time += raysSpeed * 0.016
      
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Origin point
      let originX = rect.width * 0.5
      let originY = rect.height * 0.1
      
      if (raysOrigin === 'center') {
        originY = rect.height * 0.5
      } else if (raysOrigin === 'bottom-center') {
        originY = rect.height * 0.9
      }

      // Mouse influence
      if (followMouse) {
        originX += (mouseRef.current.x * rect.width - originX) * mouseInfluence
        originY += (mouseRef.current.y * rect.height - originY) * mouseInfluence
      }

      // Draw rays
      rays.forEach((ray, i) => {
        const angle = ray.angle + Math.sin(time + i) * distortion
        const length = ray.length * rect.height * (1 + Math.sin(time * 0.5 + i) * 0.1)
        const endX = originX + Math.cos(angle) * length * lightSpread
        const endY = originY + Math.sin(angle) * length

        const gradient = ctx.createLinearGradient(originX, originY, endX, endY)
        gradient.addColorStop(0, `${raysColor}${Math.floor(ray.opacity * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(fadeDistance, `${raysColor}20`)
        gradient.addColorStop(1, 'transparent')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2 + Math.sin(time + i) * 0.5
        ctx.beginPath()
        ctx.moveTo(originX, originY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Add noise
        if (noiseAmount > 0) {
          ray.opacity += (Math.random() - 0.5) * noiseAmount
          ray.opacity = Math.max(0.05, Math.min(0.4, ray.opacity))
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (followMouse) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion])

  return <canvas ref={canvasRef} className={className} />
}