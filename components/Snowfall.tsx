"use client"

import React, { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  left: string
  delay: number
  duration: number
  size: number
  opacity: number
  swing: number
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    const createSnowflakes = () => {
      const flakes: Snowflake[] = []
      // 80 płatków śniegu
      for (let i = 0; i < 100; i++) {
        flakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 10,
          duration: 8 + Math.random() * 8, // 8-16 sekund
          size: 2 + Math.random() * 6, // 2-8px
          opacity: 0.3 + Math.random() * 0.6, // 0.3-0.9
          swing: Math.random() * 80 - 40, // -40 do 40px dla kołysania
        })
      }
      return flakes
    }

    setSnowflakes(createSnowflakes())
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute rounded-full bg-white"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            filter: 'blur(0.5px)',
            // @ts-ignore - custom CSS properties
            '--duration': `${flake.duration}s`,
            '--delay': `${-flake.delay}s`,
            '--swing': `${flake.swing}px`,
          }}
        />
      ))}
    </div>
  )
}
