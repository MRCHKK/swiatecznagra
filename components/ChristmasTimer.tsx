"use client"

import React, { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function ChristmasTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const christmas = new Date('2025-12-24T00:01:00')
      const now = new Date()
      const difference = christmas.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => String(num).padStart(2, '0')

  return (
    <div className="px-6 py-6 bg-white/60">
      <div className="text-center mb-4">
        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          Do świąt pozostało
        </span>
      </div>
      <div className="flex justify-center items-center gap-2">
        <TimeBlock value={timeLeft.days} label="dni" />
        <TimeSeparator />
        <TimeBlock value={formatNumber(timeLeft.hours)} label="godz" />
        <TimeSeparator />
        <TimeBlock value={formatNumber(timeLeft.minutes)} label="min" />
        <TimeSeparator />
        <TimeBlock value={formatNumber(timeLeft.seconds)} label="sek" />
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-white rounded-xl px-2 py-2 min-w-[48px] text-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="text-xl sm:text-2xl font-bold text-red-600 font-mono leading-none mb-1">
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-gray-600 uppercase font-semibold">
        {label}
      </div>
    </div>
  )
}

function TimeSeparator() {
  return <span className="text-xl text-gray-400 font-bold px-1">:</span>
}
