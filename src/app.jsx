import { useReducer } from "react"
import { useEffect } from "react"

const reducer = (state, action) => {
  if (action.type === 'fetch_questions') {
    return {...state, apiData: action.payload}
  }

  return state
} 

const App = () => {
  const [state, dispatch] = useReducer(reducer, { apiData: [] })

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(r => r.json())
      .then(data => dispatch({ type: 'fetch_questions', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  return (
    <div className="app">
      <main className="main">
        {state.apiData.length > 0 && 
          <>
          <div>
          <h4>Pergunta</h4>
          <ul className="options">
            <li><button className="btn btn-option">Alternativa A</button></li>
            <li><button className="btn btn-option">Alternativa B</button></li>
            <li><button className="btn btn-option">Alternativa C</button></li>
            <li><button className="btn btn-option">Alternativa D</button></li>
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
