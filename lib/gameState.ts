"use client"

interface GameState {
  unlockedGames: number[]
  completedGames: number[]
  currentGame: number
}

const STORAGE_KEY = 'christmas-game-state'

export function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return { unlockedGames: [1], completedGames: [], currentGame: 1 }
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    return JSON.parse(saved)
  }

  return { unlockedGames: [1], completedGames: [], currentGame: 1 }
}

export function saveGameState(state: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export function unlockNextGame(currentGameId: number): void {
  const state = loadGameState()
  
  if (!state.completedGames.includes(currentGameId)) {
    state.completedGames.push(currentGameId)
  }
  
  const nextGameId = currentGameId + 1
  if (nextGameId <= 6 && !state.unlockedGames.includes(nextGameId)) {
    state.unlockedGames.push(nextGameId)
    state.currentGame = nextGameId
  }
  
  saveGameState(state)
}

export function resetGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function isGameUnlocked(gameId: number): boolean {
  const state = loadGameState()
  return state.unlockedGames.includes(gameId)
}

export function isGameCompleted(gameId: number): boolean {
  const state = loadGameState()
  return state.completedGames.includes(gameId)
}