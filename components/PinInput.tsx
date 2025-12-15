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

  useEffect(() => {
    inputs.current[0]?.focus()
    
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
    <div ref={containerRef} className="space-y-6">
      <div className="flex justify-center gap-3">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el
            }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`PIN digit ${index + 1}`}
            className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none ${
              error
                ? 'border-red-500 bg-red-50 text-red-600 animate-shake'
                : digit
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-emerald-400 focus:shadow-md'
            }`}
            style={{ 
              boxShadow: digit && !error ? 'var(--shadow-sm)' : 'none',
              minHeight: '64px',
              minWidth: '56px'
            }}
          />
        ))}
      </div>
      
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 font-medium bg-red-50 py-3 px-4 rounded-xl border-2 border-red-200">
          <span className="text-xl">❌</span>
          <span>Nieprawidłowy PIN</span>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!isPinComplete}
        aria-label={buttonText}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ${
          isPinComplete
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
        }`}
        style={{ minHeight: '56px' }}
      >
        {buttonText}
      </button>
    </div>
  )
}
