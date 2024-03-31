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
        ? state.apiData[state.currentQuestion].points 
        : state.userScore }
  }

  return state
}


const initialState = { apiData: [], currentQuestion: 0, userAnswer: null, userScore: 0 }
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(r => r.json())
      .then(data => dispatch({ type: 'fetch_questions', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handleClickAnswer = option => dispatch({ type: 'user_selected_answer', payload: option })

  return (
    <div className="app">
      <main className="main">
        {state.apiData.length > 0 &&
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
                        ${state.userAnswer !== null 
                          ? state.apiData[state.currentQuestion].correctOption === index 
                            ? 'correct'
                            : 'wrong'
                          : ''}
                        `}
                      onClick={() => handleClickAnswer(index)}
                      disabled={state.userAnswer !== null}
                      >
                      {option}
                    </button>
                  </li>)}
              </ul>
            </div>
            <div>
              <button className="btn btn-ui">Próxima</button>
            </div>
          </>
        }
      </main>
    </div>
  )
}

export { App }
