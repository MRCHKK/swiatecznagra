"use client"

import React, { useState, useRef } from 'react'

interface PinInputProps {
  correctPin: string
  onSuccess: () => void
  onError?: () => void
}

export default function PinInput({ correctPin, onSuccess, onError }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

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
    <div>
      <div className="flex justify-center gap-3">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none bg-white/80 ${
              error
                ? 'border-red-400 bg-red-50/80 text-red-500'
                : digit
                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-md shadow-emerald-500/20'
                  : 'border-gray-300 text-gray-800 focus:border-emerald-400 focus:bg-white'
            }`}
            style={{ animation: error ? 'shake 0.5s' : 'none' }}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-center text-red-500 text-sm mt-3 font-medium">
          Nieprawidłowy PIN
        </p>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!isPinComplete}
        className={`w-full mt-5 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
          isPinComplete
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-98'
            : 'bg-gray-200/80 text-gray-400 cursor-not-allowed'
        }`}
      >
        Rozpocznij grę
      </button>
    </div>
  )
}