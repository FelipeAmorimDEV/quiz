import { useReducer } from "react"
import { useEffect } from "react"

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

  const maxScore = state.apiData.reduce((acc, question) => acc + question.points, 0)
  const percentage = (state.userScore * 100) / maxScore

  const userHasAnswered = state.userAnswer !== null
  return (
    <div className="app">
      <main className="main">
        {state.shouldShowResult &&
          <>
            <div className="result">
              <span>Você fez {state.userScore} pontos de {maxScore} ({percentage}%)</span>
            </div>
            <button className="btn btn-ui" onClick={handleClickResetQuiz}>Reiniciar Quiz</button>
          </>
        }
        {state.apiData.length > 0 && !state.shouldShowResult &&
          <>
            <div>
              <h4>{state.apiData[state.currentQuestion].question}</h4>
              <ul className="options">
                {state.apiData[state.currentQuestion].options.map((option, index) =>
                  <li key={option}>
                    <button
                      className={`
                        btn 
                        btn-option ${state.userAnswer === index ? 'answer' : ''}
                        ${userHasAnswered
                          ? state.apiData[state.currentQuestion].correctOption === index
                            ? 'correct'
                            : 'wrong'
                          : ''}
                        `}
                      onClick={() => handleClickAnswer(index)}
                      disabled={userHasAnswered}
                    >
                      {option}
                    </button>
                  </li>)}
              </ul>
            </div>
            <div>
              {userHasAnswered &&
                <button className="btn btn-ui" onClick={handleClickNextQuestion}>
                  {state.currentQuestion === state.apiData.length - 1 ? 'Finalizar' : 'Próxima'}
                </button>}
            </div>
          </>
        }
      </main>
    </div>
  )
}

export { App }
