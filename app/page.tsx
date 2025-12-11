"use client"

import { useState, useEffect } from "react"

export default function Page() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)

  const CONFIG = {
    questions: [
      {
        question: "Jakie zwierzę pociąga sanie Świętego Mikołaja?",
        answers: ["Renifery", "Konie", "Sarny", "Łosie"],
        correct: 0,
        clue: "To zwierzę ma poroże",
        giftLocation: "Zajrzyj pod łóżko",
        nextPin: "1605",
      },
      {
        question: "W jakim miesiącu obchodzimy Boże Narodzenie?",
        answers: ["Listopad", "Grudzień", "Styczeń", "Luty"],
        correct: 1,
        clue: "To ostatni miesiąc roku",
        giftLocation: "Sprawdź szafkę w kuchni",
        nextPin: "2412",
      },
      {
        question: "Jaki kolor ma głównie choinka?",
        answers: ["Czerwony", "Złoty", "Zielony", "Niebieski"],
        correct: 2,
        clue: "Kolor lasu",
        giftLocation: "Zajrzyj za drzwi wejściowe",
        nextPin: "3112",
      },
      {
        question: "Ile reniferów ciągnie sanie Świętego Mikołaja?",
        answers: ["6", "8", "9", "12"],
        correct: 1,
        clue: "To liczba podzielna przez 4",
        giftLocation: "Sprawdź okno w salonie",
        nextPin: "2512",
      },
      {
        question: "Co się wiesza na choinką?",
        answers: ["Kwiaty", "Ozdoby", "Liście", "Pióra"],
        correct: 1,
        clue: "Są błyszczące",
        giftLocation: "Zajrzyj pod poduszką",
        nextPin: "1912",
      },
      {
        question: "Kiedy dochodzimy do Nowego Roku?",
        answers: ["31 grudnia", "1 stycznia", "Wigilia", "Trzech Króli"],
        correct: 0,
        clue: "To ostatni dzień roku",
        giftLocation: null,
        nextPin: null,
      },
    ],
  }

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const handleCheckAnswer = (idx: number) => {
    const q = CONFIG.questions[currentQuestion]

    if (idx === q.correct) {
      setMessage({ type: "success", text: "✓ Poprawna odpowiedź!" })
      setAnswered(true)
    } else {
      setMessage({ type: "error", text: "✗ Błędna odpowiedź!" })
      setCooldownTime(60)
    }
  }

  const handleNextQuestion = () => {
    const q = CONFIG.questions[currentQuestion]
    if (currentQuestion < CONFIG.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setMessage(null)
      setAnswered(false)
      setShowClue(false)
    } else {
      setGameFinished(true)
    }
  }

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />
  }

  if (gameFinished) {
    return <FinishScreen />
  }

  const q = CONFIG.questions[currentQuestion]

  return (
    <div style={styles.container}>
      <Snowfall />
      <div style={styles.card}>
        <div style={styles.progress}>{currentQuestion + 1}/6</div>
        <h1 style={styles.title}>{q.question}</h1>

        {!answered ? (
          <div>
            <div style={styles.answersContainer}>
              {q.answers.map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCheckAnswer(idx)}
                  disabled={cooldownTime > 0}
                  style={{
                    ...styles.answerButton,
                    opacity: cooldownTime > 0 ? 0.5 : 1,
                    cursor: cooldownTime > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {ans}
                </button>
              ))}
            </div>

            {cooldownTime > 0 && <div style={styles.cooldown}>⏳ Czekaj {cooldownTime} sekund...</div>}

            {cooldownTime === 0 && !answered && (
              <button onClick={() => setShowClue(!showClue)} style={styles.hintButton}>
                {showClue ? "✓ Wskazówka" : "Pokaż wskazówkę"}
              </button>
            )}

            {showClue && <div style={styles.clueBox}>{q.clue}</div>}
          </div>
        ) : (
          <div>
            {message && (
              <div style={{ ...styles.message, color: message.type === "success" ? "#28a745" : "#dc3545" }}>
                {message.text}
              </div>
            )}

            <div style={styles.giftBox}>
              <div style={styles.giftTitle}>📍 PODPOWIEDŹ:</div>
              <div style={styles.giftLocation}>{q.giftLocation}</div>
              {q.nextPin && (
                <div style={styles.pinBox}>
                  <div style={styles.pinLabel}>PIN do następnego pytania:</div>
                  <div style={styles.pinCode}>{q.nextPin}</div>
                </div>
              )}
            </div>

            <button onClick={handleNextQuestion} style={styles.nextButton}>
              {currentQuestion < CONFIG.questions.length - 1 ? "Dalej →" : "Do prezentu →"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={styles.container}>
      <Snowfall />
      <div style={styles.card}>
        <div style={styles.welcomeTitle}>🎄 Julka ratuje święta 🎄</div>
        <div style={styles.welcomeText}>Pomóż Julce rozwiązać 6 zagadek świątecznych. Czeka Cię mnóstwo prezentów!</div>
        <div style={styles.instructions}>
          <p>Instrukcja:</p>
          <ul style={{ textAlign: "left", marginLeft: "20px" }}>
            <li>Odpowiedz na pytanie wybierając a/b/c/d</li>
            <li>Jeśli źle - czekaj 1 minutę na kolejną próbę</li>
            <li>Każda poprawna odpowiedź to podpowiedź do prezentu i PIN</li>
            <li>Po 6 pytaniach - główny prezent!</li>
          </ul>
        </div>
        <button onClick={onStart} style={styles.startButton}>
          Zaczynamy! 🎁
        </button>
      </div>
    </div>
  )
}

function FinishScreen() {
  return (
    <div style={styles.container}>
      <Snowfall />
      <div style={styles.card}>
        <div style={styles.finishTitle}>🎉 Gratulacje! 🎉</div>
        <div style={styles.finishMessage}>Przygotuj się na swój główny prezent świąteczny!</div>
        <div style={styles.celebrationEmoji}>🎁✨❄️</div>
      </div>
    </div>
  )
}

function Snowfall() {
  return (
    <div style={styles.snowfallContainer}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.snowflake,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%)",
    padding: "10px",
    position: "relative",
    overflow: "hidden",
  } as const,
  snowfallContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  } as const,
  snowflake: {
    position: "absolute",
    top: "-10px",
    fontSize: "24px",
    animation: "fall linear infinite",
    opacity: 0.8,
  } as const,
  card: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    padding: "30px",
    maxWidth: "600px",
    width: "100%",
    position: "relative",
    zIndex: 1,
  } as const,
  progress: {
    textAlign: "center",
    color: "#999",
    marginBottom: "15px",
    fontSize: "14px",
  } as const,
  title: {
    fontSize: "24px",
    marginBottom: "25px",
    color: "#1a472a",
    textAlign: "center",
    fontWeight: "bold",
  } as const,
  answersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  } as const,
  answerButton: {
    padding: "15px",
    background: "#f0f0f0",
    border: "2px solid #ddd",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.2s",
  } as const,
  cooldown: {
    textAlign: "center",
    color: "#dc3545",
    fontWeight: "bold",
    padding: "15px",
    background: "#ffe0e0",
    borderRadius: "8px",
    marginBottom: "15px",
  } as const,
  hintButton: {
    width: "100%",
    padding: "12px",
    background: "#ffc107",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "15px",
  } as const,
  clueBox: {
    background: "#fff3cd",
    borderLeft: "4px solid #ffc107",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "4px",
    color: "#856404",
  } as const,
  message: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "18px",
  } as const,
  giftBox: {
    background: "#e8f5e9",
    border: "2px solid #4caf50",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    textAlign: "center",
  } as const,
  giftTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "10px",
  } as const,
  giftLocation: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: "15px",
  } as const,
  pinBox: {
    background: "#fff9c4",
    borderRadius: "8px",
    padding: "15px",
    marginTop: "15px",
  } as const,
  pinLabel: {
    fontSize: "12px",
    color: "#f57f17",
    marginBottom: "8px",
  } as const,
  pinCode: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#f57f17",
    letterSpacing: "4px",
  } as const,
  nextButton: {
    width: "100%",
    padding: "15px",
    background: "#c41e3a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  } as const,
  welcomeTitle: {
    fontSize: "36px",
    textAlign: "center",
    color: "#c41e3a",
    marginBottom: "20px",
    fontWeight: "bold",
  } as const,
  welcomeText: {
    fontSize: "18px",
    textAlign: "center",
    color: "#333",
    marginBottom: "25px",
  } as const,
  instructions: {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#555",
  } as const,
  startButton: {
    width: "100%",
    padding: "15px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  } as const,
  finishTitle: {
    fontSize: "36px",
    textAlign: "center",
    color: "#c41e3a",
    marginBottom: "20px",
    fontWeight: "bold",
  } as const,
  finishMessage: {
    fontSize: "22px",
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  } as const,
  celebrationEmoji: {
    fontSize: "48px",
    textAlign: "center",
    animation: "bounce 1s infinite",
  } as const,
}

const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh);
    }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`
if (typeof document !== "undefined") {
  document.head.appendChild(styleSheet)
}
