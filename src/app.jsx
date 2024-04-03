import { useReducer, useState, useRef } from "react"
import { useEffect } from "react"

const Timer = ({ seconds, onTimerFinished }) => {
  const futureDate = new Date()
  const finalTimeInMillis = futureDate.setTime(futureDate.getTime() + seconds * 1000)

  const [timer, setTimer] = useState({ distanceInMillis: 0, finalTimeInMillis })

  useEffect(() => {
    const diferenceInMillis = timer.finalTimeInMillis - new Date()
    const id = setInterval(() => setTimer(t => ({ ...t, distanceInMillis: diferenceInMillis })), 1000)
    if (diferenceInMillis <= 0) {
      clearInterval(id)
      onTimerFinished()
    }

    return () => clearInterval(id)
  }, [onTimerFinished, timer])

  const diferenceInMinutes = Math.floor(timer.distanceInMillis / (1000 * 60))
  const diferenceInSeconds = Math.floor((timer.distanceInMillis % (1000 * 60)) / 1000)

  return <p>{`${String(diferenceInMinutes).padStart(2, '0')}:${String(diferenceInSeconds).padStart(2, '0')}`}</p>
}

const reducer = (state, action) => {
  if (action.type === 'fetch_questions') {
    return { ...state, apiData: action.payload }
  }

  if (action.type === 'user_selected_answer') {
    return {
      ...state,
      userAnswer: action.payload,
      userScore: state.apiData[state.currentQuestion].correctOption === action.payload
        ? state.userScore + state.apiData[state.currentQuestion].points
        : state.userScore
    }
  }

  if (action.type === 'clicked_next_question') {
    const isLastQuestion = state.currentQuestion === state.apiData.length - 1

    return {
      ...state,
      currentQuestion: isLastQuestion
        ? 0
        : state.currentQuestion + 1,
      userAnswer: null,
      shouldShowResult: isLastQuestion
    }
  }

  if (action.type === 'reset_quiz') {
    return { ...state, userAnswer: null, shouldShowResult: false, userScore: 0 }
  }

  if (action.type === 'ended_timer') {
    return {...state, shouldShowResult: true}
  }

  return state
}

const initialState = { apiData: [], currentQuestion: 0, userAnswer: null, userScore: 0, shouldShowResult: false }

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(r => r.json())
      .then(data => dispatch({ type: 'fetch_questions', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handleClickAnswer = option => dispatch({ type: 'user_selected_answer', payload: option })
  const handleClickNextQuestion = () => dispatch({ type: 'clicked_next_question' })
  const handleClickResetQuiz = () => dispatch({ type: 'reset_quiz' })
  const timerFinished = () => dispatch({ type: 'ended_timer' })

  const maxScore = state.apiData.reduce((acc, question) => acc + question.points, 0)
  const percentage = (state.userScore * 100) / maxScore
  const totalSeconds = state.apiData.length * 30
  const userHasAnswered = state.userAnswer !== null
  const answerProgress = userHasAnswered  ? state.currentQuestion + 1 : state.currentQuestion
  const resultMsg = {
    '0': "😥 Poxa, você",
    '20': "😑 Você fez",
    '40': "😐 Opa! Você",
    '60': "😉 Legal! Você",
    '80': "😎 Muito bom! Você",
    '100': "🏆 Caramba! Você"
  }[`${percentage}`]

  return (
    <div className="app">
      <header className="app-header">
        <img src="logo-quiz-videogames.png" alt="Logo do Quiz de Videogammes" />
        <h1>Quiz dos Videogames</h1>
      </header>
      <main className="main">
        {state.shouldShowResult &&
          <>
            <div className="result">
              <span>{resultMsg} {state.userScore} pontos de {maxScore} ({percentage}%)</span>
            </div>
            <button className="btn btn-ui" onClick={handleClickResetQuiz}>Reiniciar Quiz</button>
          </>
        }
        {state.apiData.length > 0 && !state.shouldShowResult &&
          <>
            <label className="progress">
              <progress value={answerProgress} max={5}/>
              <span>Questão <strong>{state.currentQuestion + 1}</strong> / {state.apiData.length}</span>
              <span><strong>{state.userScore}</strong> / {maxScore}</span>
            </label>
            <div>
              <h4>{state.apiData[state.currentQuestion].question}</h4>
              <ul className="options">
                {state.apiData[state.currentQuestion].options.map((option, index) => {
                  const answerClass = state.userAnswer === index ? 'answer' : ''
                  const correctOrWrongClass = userHasAnswered
                    ? state.apiData[state.currentQuestion].correctOption === index
                      ? 'correct'
                      : 'wrong'
                    : ''

                  return (
                    <li key={option}>
                      <button
                        className={`btn btn-option ${answerClass} ${correctOrWrongClass}`}
                        onClick={() => handleClickAnswer(index)}
                        disabled={userHasAnswered}
                      >
                        {option}
                      </button>
                    </li>
                  )
                }
                )}
              </ul>
            </div>
            <div>
              {userHasAnswered &&
                <button className="btn btn-ui" onClick={handleClickNextQuestion}>
                  {state.currentQuestion === state.apiData.length - 1 ? 'Finalizar' : 'Próxima'}
                </button>}
              <div className="timer">
                <Timer seconds={totalSeconds} onTimerFinished={timerFinished}/>
              </div>
            </div>
          </>
        }
      </main>
    </div>
  )
}

export { App }
