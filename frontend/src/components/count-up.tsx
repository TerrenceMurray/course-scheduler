import { useState, useEffect } from 'react'

interface CountUpProps {
  value: string | number
  duration?: number
  suffix?: string
}

export function CountUp({ value, duration = 1000, suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0)

  // Extract numeric part from value
  const numericValue = typeof value === 'number'
    ? value
    : parseInt(value.replace(/[^0-9]/g, ''), 10) || 0

  // Extract suffix from value if not provided
  const valueSuffix = suffix || (typeof value === 'string' ? value.replace(/[0-9]/g, '') : '')

  useEffect(() => {
    if (numericValue === 0) {
      setCount(0)
      return
    }

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setCount(Math.floor(easeOutQuart * numericValue))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, duration])

  return <>{count}{valueSuffix}</>
}
