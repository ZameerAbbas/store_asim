import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'

interface AnimatedElementProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  x?: number
  opacity?: number
  ease?: string
}

export function AnimatedElement({
  children,
  delay = 0,
  duration = 1,
  y = 0,
  x = 0,
  opacity = 1,
  ease = 'power3.out'
}: AnimatedElementProps) {
  const elementRef = useRef(null)

  useEffect(() => {
    gsap.from(elementRef.current, {
      duration,
      y,
      x,
      opacity,
      ease,
      delay,
    })
  }, [delay, duration, y, x, opacity, ease])

  return null
}

