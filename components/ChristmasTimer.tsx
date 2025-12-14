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
    <div className="px-4 py-4 bg-white/40">
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Do świąt pozostało
        </span>
      </div>
      <div className="flex justify-center items-center gap-1.5">
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
    <div className="bg-white/80 rounded-lg px-2 py-1.5 shadow-sm min-w-12 text-center">
      <div className="text-lg font-bold text-red-500 font-mono">{value}</div>
      <div className="text-[9px] text-gray-500 uppercase font-semibold">{label}</div>
    </div>
  )
}

function TimeSeparator() {
  return <span className="text-lg text-gray-400 font-bold">:</span>
}