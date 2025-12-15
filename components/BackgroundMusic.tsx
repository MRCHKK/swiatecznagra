"use client"

import React, { useState, useEffect, useRef } from 'react'

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/music/jingle-bells.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

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
    <div className="fixed bottom-4 right-4 flex gap-3 safe-bottom" style={{ zIndex: 100 }}>
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Zatrzymaj muzykę" : "Odtwórz muzykę"}
        className="w-14 h-14 rounded-full bg-white shadow-lg border-2 border-red-200 flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95"
        style={{ minWidth: '56px', minHeight: '56px' }}
      >
        <span className="text-2xl">{isPlaying ? '⏸️' : '🎵'}</span>
      </button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Wyłącz wyciszenie" : "Wycisz"}
          className="w-14 h-14 rounded-full bg-white shadow-lg border-2 border-red-200 flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95 slide-in"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
      )}
    </div>
  )
}
