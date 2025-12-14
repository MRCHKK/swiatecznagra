"use client"

import React, { useState, useRef, useEffect } from 'react'

interface PinInputProps {
  correctPin: string
  onSuccess: () => void
  onError?: () => void
  buttonText?: string
}

export default function PinInput({ correctPin, onSuccess, onError, buttonText = "Kontynuuj" }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-focus first input and scroll into view on mount
  useEffect(() => {
    inputs.current[0]?.focus()
    
    // Scroll to input after a delay (for keyboard animation)
    const timer = setTimeout(() => {
      containerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError(false)

    // Auto-focus next input
    if (value && index < 3) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    const enteredPin = pin.join('')
    if (enteredPin === correctPin) {
      onSuccess()
    } else {
      setError(true)
      setPin(['', '', '', ''])
      inputs.current[0]?.focus()
      if (onError) onError()
      
      setTimeout(() => setError(false), 1500)
    }
  }

  const isPinComplete = pin.every((digit) => digit !== '')

  return (
    <div ref={containerRef} className="space-y-4 sm:space-y-5">
      <div className="flex justify-center gap-2 sm:gap-3">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el
            }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none shadow-sm ${
              error
                ? 'border-red-400 bg-red-50 text-red-600 shadow-red-500/20 animate-shake'
                : digit
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/20'
                  : 'border-gray-300 bg-white text-gray-800 focus:border-emerald-400 focus:shadow-md focus:shadow-emerald-500/10'
            }`}
          />
        ))}
      </div>
      
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium bg-red-50 py-2 px-4 rounded-lg border border-red-200">
          <span>❌</span>
          <span>Nieprawidłowy PIN</span>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!isPinComplete}
        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
          isPinComplete
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-98'
            : 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
        }`}
      >
        {buttonText}
      </button>
    </div>
  )
}
