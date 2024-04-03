import { useReducer, useEffect } from 'react'

const quizReducer = (state, action) => {
  const isLastQuestion = state.currentQuestion === state.quizData.length - 1
  return ({
    'FETCH_QUESTIONS': { ...state, quizData: action?.payload },
    'USER_SELECTED_ANSWER': {
      ...state,
      userAnswer: action.payload,
      userScore: state.quizData[state.currentQuestion]?.correctOption === action.payload
        ? state.userScore + state.quizData[state.currentQuestion].points
        : state.userScore
    },
    'CLICKED_NEXT_QUESTION': {
      ...state,
      currentQuestion: isLastQuestion
        ? 0
        : state.currentQuestion + 1,
      userAnswer: null,
      appStatus: isLastQuestion ? 'finished' : 'playing'
    },
    'RESET_QUIZ': { ...state, userAnswer: null, userScore: 0, currentQuestion: 0, appStatus: 'readyToPlay' },
    'ENDED_TIMER': { ...state, appStatus: 'finished' },
    'STARTED_QUIZ': { ...state, appStatus: 'playing' }
  })[action.type] || state
}

const initialState = { quizData: [], currentQuestion: 0, userAnswer: null, userScore: 0, appStatus: 'readyToPlay' }

const useQuiz = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_QUESTIONS', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handlers = {
    handleAnswerClick: option => dispatch({ type: 'USER_SELECTED_ANSWER', payload: option }),
    handleNextQuestionClick: () => dispatch({ type: 'CLICKED_NEXT_QUESTION' }),
    handleResetQuizClick: () => dispatch({ type: 'RESET_QUIZ' }),
    handleTimerFinished: () => dispatch({ type: 'ENDED_TIMER' }),
    handleStartQuizClick: () => dispatch({ type: 'STARTED_QUIZ' })
  }

  return { state, handlers }
}

export { useQuiz }