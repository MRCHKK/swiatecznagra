"use client"

import React, { useState, useEffect, useRef } from 'react'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Stwórz element audio
    audioRef.current = new Audio('/music/jingle-bells.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3 // 30% głośności

    // Sprawdź czy użytkownik już włączył muzykę wcześniej
    const musicPreference = localStorage.getItem('music-enabled')
    if (musicPreference === 'true') {
      playMusic()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log('Autoplay zablokowany:', error)
      })
      setIsPlaying(true)
      localStorage.setItem('music-enabled', 'true')
    }
  }

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      localStorage.setItem('music-enabled', 'false')
    }
  }

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic()
    } else {
      playMusic()
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <button
        onClick={toggleMusic}
        className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-red-200 flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        title={isPlaying ? "Zatrzymaj muzykę" : "Odtwórz muzykę"}
      >
        {isPlaying ? (
          <span className="text-xl">⏸️</span>
        ) : (
          <span className="text-xl">🎵</span>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 border-red-200 flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95"
          title={isMuted ? "Wyłącz wyciszenie" : "Wycisz"}
        >
          {isMuted ? (
            <span className="text-xl">🔇</span>
          ) : (
            <span className="text-xl">🔊</span>
          )}
        </button>
      )}
    </div>
  )
}