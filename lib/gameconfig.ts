export interface GameConfig {
  id: number
  type: 'tictactoe' | 'question'
  title: string
  nextPin?: string
  giftLocation?: string
  questionData?: {
    question: string
    answers: string[]
    correctAnswer: number
    clue: string
  }
}

export const GAMES_CONFIG: GameConfig[] = [
  {
    id: 1,
    type: 'tictactoe',
    title: 'Gra w kółko i krzyżyk',
    giftLocation: 'Zajrzyj pod łóżko',
    nextPin: '1605',
  },
  {
    id: 2,
    type: 'question',
    title: 'Pytanie 2',
    giftLocation: 'Sprawdź szafkę w kuchni',
    nextPin: '2412',
    questionData: {
      question: 'W jakim miesiącu obchodzimy Boże Narodzenie?',
      answers: ['Listopad', 'Grudzień', 'Styczeń', 'Luty'],
      correctAnswer: 1,
      clue: 'To ostatni miesiąc roku',
    },
  },
  {
    id: 3,
    type: 'question',
    title: 'Pytanie 3',
    giftLocation: 'Zajrzyj za drzwi wejściowe',
    nextPin: '3112',
    questionData: {
      question: 'Jaki kolor ma głównie choinka?',
      answers: ['Czerwony', 'Złoty', 'Zielony', 'Niebieski'],
      correctAnswer: 2,
      clue: 'Kolor lasu',
    },
  },
  {
    id: 4,
    type: 'question',
    title: 'Pytanie 4',
    giftLocation: 'Sprawdź okno w salonie',
    nextPin: '2512',
    questionData: {
      question: 'Ile reniferów ciągnie sanie Świętego Mikołaja?',
      answers: ['6', '8', '9', '12'],
      correctAnswer: 1,
      clue: 'To liczba podzielna przez 4',
    },
  },
  {
    id: 5,
    type: 'question',
    title: 'Pytanie 5',
    giftLocation: 'Zajrzyj pod poduszką',
    nextPin: '1912',
    questionData: {
      question: 'Co się wiesza na choinkę?',
      answers: ['Kwiaty', 'Ozdoby', 'Liście', 'Pióra'],
      correctAnswer: 1,
      clue: 'Są błyszczące',
    },
  },
  {
    id: 6,
    type: 'question',
    title: 'Pytanie 6',
    giftLocation: null,
    nextPin: null,
    questionData: {
      question: 'Kiedy dochodzimy do Nowego Roku?',
      answers: ['31 grudnia', '1 stycznia', 'Wigilia', 'Trzech Króli'],
      correctAnswer: 0,
      clue: 'To ostatni dzień roku',
    },
  },
]

export const START_PIN = '0102'