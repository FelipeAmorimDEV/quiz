import { useReducer, useState, useRef } from "react"
import { useEffect } from "react"

const Timer = ({ seconds, onTimerFinished }) => {
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const lastRenderTimeRef = useRef(new Date().getTime());

  useEffect(() => {
    const timerId = setTimeout(() => {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastRenderTimeRef.current;
      const newTimeRemaining = Math.max(0, timeRemaining - Math.floor(timeElapsed / 1000));
      setTimeRemaining(newTimeRemaining);
      lastRenderTimeRef.current = currentTime;

      if (newTimeRemaining === 0) {
        onTimerFinished();
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeRemaining, onTimerFinished]);

  const minutes = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  return (
    <p>
      {`${String(minutes).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`}
    </p>
  )
}

const quizReducer = (state, action) => {
  if (action.type === 'FETCH_QUESTIONS') {
    return { ...state, quizData: action.payload }
  }

  if (action.type === 'USER_SELECTED_ANSWER') {
    return {
      ...state,
      userAnswer: action.payload,
      userScore: state.quizData[state.currentQuestion].correctOption === action.payload
        ? state.userScore + state.quizData[state.currentQuestion].points
        : state.userScore
    }
  }

  if (action.type === 'CLICKED_NEXT_QUESTION') {
    const isLastQuestion = state.currentQuestion === state.quizData.length - 1

    return {
      ...state,
      currentQuestion: isLastQuestion
        ? 0
        : state.currentQuestion + 1,
      userAnswer: null,
      shouldShowResult: isLastQuestion
    }
  }

  if (action.type === 'RESET_QUIZ') {
    return { ...state, userAnswer: null, shouldShowResult: false, userScore: 0, shouldShowMenu: true }
  }

  if (action.type === 'ENDED_TIMER') {
    return {...state, shouldShowResult: true}
  }

  if (action.type === 'STARTED_QUIZ') {
    return {... state, shouldShowMenu: false }
  }

  return state
}

const initialState = { quizData: [], currentQuestion: 0, userAnswer: null, userScore: 0, shouldShowResult: false, shouldShowMenu: true }

const App = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_QUESTIONS', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handleAnswerClick = option => dispatch({ type: 'USER_SELECTED_ANSWER', payload: option })
  const handleNextQuestionClick = () => dispatch({ type: 'CLICKED_NEXT_QUESTION' })
  const handleResetQuizClick = () => dispatch({ type: 'RESET_QUIZ' })
  const handleTimerFinished = () => dispatch({ type: 'ENDED_TIMER' })
  const handleStartQuizClick = () => dispatch({ type: 'STARTED_QUIZ'})

  const maxScore = state.quizData.reduce((acc, question) => acc + question.points, 0)
  const percentage = (state.userScore * 100) / maxScore
  const totalSeconds = state.quizData.length * 30
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
        {state.shouldShowMenu && 
          <div className="start">
            <h2>Bem vindo(a) ao Quiz dos Videogames!</h2>
            <h3>{state.quizData.length} questões pra te testar</h3>
            <button className="btn" onClick={handleStartQuizClick}>Bora começar</button>
          </div>
        }
        {state.shouldShowResult && !state.shouldShowMenu &&
          <>
            <div className="result">
              <span>{resultMsg} {state.userScore} pontos de {maxScore} ({percentage}%)</span>
            </div>
            <button className="btn btn-ui" onClick={handleResetQuizClick}>Reiniciar Quiz</button>
          </>
        }
        {state.quizData.length > 0 && !state.shouldShowResult && !state.shouldShowMenu &&
          <>
            <label className="progress">
              <progress value={answerProgress} max={5}/>
              <span>Questão <strong>{state.currentQuestion + 1}</strong> / {state.quizData.length}</span>
              <span><strong>{state.userScore}</strong> / {maxScore}</span>
            </label>
            <div>
              <h4>{state.quizData[state.currentQuestion].question}</h4>
              <ul className="options">
                {state.quizData[state.currentQuestion].options.map((option, index) => {
                  const answerClass = state.userAnswer === index ? 'answer' : ''
                  const correctOrWrongClass = userHasAnswered
                    ? state.quizData[state.currentQuestion].correctOption === index
                      ? 'correct'
                      : 'wrong'
                    : ''

                  return (
                    <li key={option}>
                      <button
                        className={`btn btn-option ${answerClass} ${correctOrWrongClass}`}
                        onClick={() => handleAnswerClick(index)}
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
                <button className="btn btn-ui" onClick={handleNextQuestionClick}>
                  {state.currentQuestion === state.quizData.length - 1 ? 'Finalizar' : 'Próxima'}
                </button>}
              <div className="timer">
                <Timer seconds={totalSeconds} onTimerFinished={handleTimerFinished}/>
              </div>
            </div>
          </>
        }
      </main>
    </div>
  )
}

export { App }