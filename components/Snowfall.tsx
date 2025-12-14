"use client"

import React, { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  left: string
  delay: number
  duration: number
  size: number
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    const createSnowflakes = () => {
      const flakes: Snowflake[] = []
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 8,
          duration: 6 + Math.random() * 6,
          size: 3 + Math.random() * 5,
        })
      }
      return flakes
    }

    setSnowflakes(createSnowflakes())
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: `${-10 + (flake.delay / 8) * -100}%`,
            opacity: 0.6 + Math.random() * 0.3,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `-${flake.delay}s`,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
          }}
        />
      ))}
    </div>
  )
}