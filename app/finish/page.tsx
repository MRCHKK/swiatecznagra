"use client"

import React from 'react'
import Link from 'next/link'
import Snowfall from '@/components/Snowfall'
import { resetGameState } from '@/lib/gameState'

export default function FinishPage() {
  const handleReset = () => {
    resetGameState()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6" style={{ animation: 'bounce 1s infinite' }}>
            🎁
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Gratulacje Julka!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Uratowałaś święta! Wszystkie zadania zostały ukończone i ostatni prezent czeka na Ciebie!
          </p>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 mb-6 border border-amber-200">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              🏆 Certyfikat Bohatera Świąt
            </h3>
            <p className="text-amber-700">
              Niniejszym zaświadczamy, że <strong>Julka</strong> pomyślnie ukończyła wszystkie wyzwania i uratowała Boże Narodzenie!
            </p>
            <div className="mt-4 text-sm text-amber-600">
              Data: {new Date().toLocaleDateString('pl-PL')}
            </div>
          </div>

          <div className="flex justify-center gap-2 text-3xl mb-6">
            <span>🎄</span>
            <span>✨</span>
            <span>❄️</span>
            <span>🎅</span>
            <span>🎉</span>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all"
            >
              Wróć do menu głównego
            </Link>
            
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 underline"
            >
              Zagraj ponownie od początku
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}