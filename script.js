// Game Configuration
const CONFIG = {
  defaultPin: "0000",
  questions: [
    {
      id: 1,
      question: "Gdzie poznaliśmy się po raz pierwszy?",
      options: ["A) W szkole", "B) Na imprezie", "C) W pracy", "D) Online"],
      correct: "A",
      hint: "Zajrzyj pod łóżko",
      nextPin: "1605",
    },
    {
      id: 2,
      question: "Jaki był nasz pierwszy wspólny film?",
      options: ["A) Titanic", "B) Avatar", "C) Inception", "D) Interstellar"],
      correct: "C",
      hint: "Sprawdź w kuchni za lodówką",
      nextPin: "2412",
    },
    {
      id: 3,
      question: "Gdzie byliśmy na pierwszej randce?",
      options: ["A) Kino", "B) Restauracja", "C) Park", "D) Plaża"],
      correct: "B",
      hint: "Poszukaj w szafie między swetrami",
      nextPin: "1234",
    },
    {
      id: 4,
      question: "Jaki jest mój ulubiony kolor?",
      options: ["A) Niebieski", "B) Zielony", "C) Różowy", "D) Żółty"],
      correct: "A",
      hint: "Zerknij do łazienki pod umywalkę",
      nextPin: "5678",
    },
    {
      id: 5,
      question: "Co zawsze mówię przed snem?",
      options: ["A) Dobranoc", "B) Śpij dobrze", "C) Do jutra", "D) Na zawsze"],
      correct: "B",
      hint: "Zobacz co kryje się za telewizorem",
      nextPin: "9999",
    },
    {
      id: 6,
      question: "Które miejsce jest naszym ulubionym?",
      options: ["A) Góry", "B) Morze", "C) Las", "D) Miasto"],
      correct: "A",
      hint: "Sprawdź na balkonie w doniczce",
      nextPin: "7777",
    },
  ],
}

// Game State
let gameState = {
  currentScreen: "pin",
  currentQuestion: 0,
  soundEnabled: true,
  showHint: false,
}

// Initialize
function init() {
  loadGameState()
  createSnow()
  render()
  setupEventListeners()
  startTimer()
}

// LocalStorage Management
function loadGameState() {
  const saved = localStorage.getItem("christmasGame")
  if (saved) {
    gameState = JSON.parse(saved)
  }
}

function saveGameState() {
  localStorage.setItem("christmasGame", JSON.stringify(gameState))
}

// Timer
function startTimer() {
  setInterval(updateTimer, 1000)
  updateTimer()
}

function updateTimer() {
  const christmas = new Date(2024, 11, 24, 0, 0, 0)
  const now = new Date()
  const diff = christmas - now

  if (diff < 0) {
    document.querySelector(".timer").textContent = "🎄 Wesoły Boże Narodzenie!"
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  document.querySelector(".timer").textContent =
    `${String(days).padStart(2, "0")} : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
}

// Snow Effect
function createSnow() {
  const snow = document.createElement("div")
  snow.className = "snow"
  document.body.appendChild(snow)

  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement("div")
    snowflake.className = "snowflake"
    snowflake.textContent = "❄"
    snowflake.style.left = Math.random() * 100 + "%"
    snowflake.style.animationDuration = Math.random() * 10 + 10 + "s"
    snowflake.style.animationDelay = Math.random() * 2 + "s"
    snowflake.style.fontSize = Math.random() * 20 + 10 + "px"
    snow.appendChild(snowflake)
  }
}

// Sound
function playSound(type) {
  if (!gameState.soundEnabled) return

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.connect(gain)
  gain.connect(audioContext.destination)

  if (type === "success") {
    oscillator.frequency.value = 800
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }
}

// Confetti
function createConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"
    confetti.style.left = Math.random() * 100 + "%"
    confetti.style.top = "-10px"
    confetti.textContent = ["🎁", "🎄", "⭐", "❄", "🎉"][Math.floor(Math.random() * 5)]
    confetti.style.fontSize = "20px"
    document.getElementById("app").appendChild(confetti)

    const duration = Math.random() * 2 + 2
    confetti.animate(
      [
        { transform: "translateY(0) rotate(0deg)", opacity: 1 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 },
      ],
      {
        duration: duration * 1000,
        easing: "ease-in",
      },
    )

    setTimeout(() => confetti.remove(), duration * 1000)
  }
}

// Render
function render() {
  const app = document.getElementById("app")
  let html = `
        <div class="timer">00:00:00:00</div>
        <button class="mute-btn" id="muteBtn">${gameState.soundEnabled ? "🔊" : "🔇"}</button>
        <div class="screen">
    `

  if (gameState.currentScreen === "pin") {
    html += `
            <div class="pin-screen">
                <h1>🎄 Julka ratuje święta 🎄</h1>
                <p>Wpisz PIN aby zacząć</p>
                <div class="pin-input-group">
                    <input class="pin-input" type="text" maxlength="1" id="pin0">
                    <input class="pin-input" type="text" maxlength="1" id="pin1">
                    <input class="pin-input" type="text" maxlength="1" id="pin2">
                    <input class="pin-input" type="text" maxlength="1" id="pin3">
                </div>
                <button class="pin-button" id="pinBtn">Dalej</button>
                <div id="errorMsg" class="error-message"></div>
            </div>
        `
  } else if (gameState.currentScreen === "question") {
    const q = CONFIG.questions[gameState.currentQuestion]
    const progress = (gameState.currentQuestion / CONFIG.questions.length) * 100
    html += `
            <div class="question-screen">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <h2 class="question-title">${q.question}</h2>
                <div class="options">
                    ${q.options
                      .map(
                        (opt, i) => `
                        <button class="option-btn" data-option="${String.fromCharCode(65 + i)}">${opt}</button>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `
  } else if (gameState.currentScreen === "hint") {
    const q = CONFIG.questions[gameState.currentQuestion]
    html += `
            <div class="hint-screen">
                <h2>✨ Wskazówka ✨</h2>
                <div class="hint-box">${q.hint}</div>
                <p>Następny PIN:</p>
                <div class="pin-display">${q.nextPin}</div>
                <button class="hint-button" id="nextBtn">Następne pytanie</button>
            </div>
        `
  } else if (gameState.currentScreen === "final") {
    html += `
            <div class="final-screen">
                <h1>🎉 Gratulacje! 🎉</h1>
                <p>Uratowałaś święta!</p>
                <div class="certificate">
                    <h3>Certyfikat Ratowania Świąt</h3>
                    <p>Dla osoby, która uratowała Boże Narodzenie</p>
                    <div class="certificate-name" id="certName">Julka</div>
                    <p>Data: ${new Date().toLocaleDateString("pl-PL")}</p>
                </div>
                <button class="hint-button" id="restartBtn">Graj ponownie</button>
            </div>
        `
  }

  html += `</div>`
  app.innerHTML = html
  setupEventListeners()
}

// Event Listeners
function setupEventListeners() {
  const muteBtn = document.getElementById("muteBtn")
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      gameState.soundEnabled = !gameState.soundEnabled
      saveGameState()
      render()
    })
  }

  if (gameState.currentScreen === "pin") {
    setupPinListeners()
  } else if (gameState.currentScreen === "question") {
    setupQuestionListeners()
  } else if (gameState.currentScreen === "hint") {
    const nextBtn = document.getElementById("nextBtn")
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        gameState.currentQuestion++
        if (gameState.currentQuestion >= CONFIG.questions.length) {
          gameState.currentScreen = "final"
        } else {
          gameState.currentScreen = "question"
        }
        saveGameState()
        render()
      })
    }
  } else if (gameState.currentScreen === "final") {
    const restartBtn = document.getElementById("restartBtn")
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        localStorage.removeItem("christmasGame")
        gameState = { currentScreen: "pin", currentQuestion: 0, soundEnabled: true, showHint: false }
        render()
      })
    }
  }
}

function setupPinListeners() {
  const inputs = document.querySelectorAll(".pin-input")
  inputs.forEach((input, i) => {
    input.addEventListener("input", (e) => {
      if (e.target.value && i < inputs.length - 1) {
        inputs[i + 1].focus()
      }
    })
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && i > 0) {
        inputs[i - 1].focus()
      }
    })
  })

  const pinBtn = document.getElementById("pinBtn")
  if (pinBtn) {
    pinBtn.addEventListener("click", () => {
      const pin = Array.from(inputs)
        .map((i) => i.value)
        .join("")
      if (pin === CONFIG.defaultPin) {
        gameState.currentScreen = "question"
        saveGameState()
        render()
      } else {
        document.getElementById("errorMsg").textContent = "Błędny PIN!"
        inputs.forEach((i) => (i.value = ""))
        inputs[0].focus()
      }
    })
  }
}

function setupQuestionListeners() {
  const buttons = document.querySelectorAll(".option-btn")
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = CONFIG.questions[gameState.currentQuestion]
      const isCorrect = btn.dataset.option === q.correct

      buttons.forEach((b) => (b.style.pointerEvents = "none"))

      if (isCorrect) {
        btn.classList.add("correct")
        playSound("success")
        createConfetti()
        setTimeout(() => {
          gameState.currentScreen = "hint"
          saveGameState()
          render()
        }, 1000)
      } else {
        btn.classList.add("wrong")
        setTimeout(() => {
          document.getElementById("errorMsg") ? null : location.reload()
        }, 1000)
      }
    })
  })
}

// Start
init()
