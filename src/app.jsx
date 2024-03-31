const App = () => {
  return (
    <div className="app">
      <main className="main">
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
      </main>
    </div>
  )
}

export { App }
