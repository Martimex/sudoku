import React, { useState } from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {

  const [state, setState] = useState('landing');

  const [difficulty, setDifficulty] = useState(null); // string
  //const [timer, setTimer] = useState(false);
  //const [counter, setCounter] = useState(false);
  const [theme, setTheme] = useState('night');

  const [options, setOptions] = useState({
    timer: false,
    backlit: false,
  })

  const triggerPlay = (...args) => {
    setState('sudoku');
  }

  const triggerBack = () => {
    setState('landing');
    setOptions({
      timer: false,
      backlit: false,
    })
  }

  return(
    <div className="App">
      <ErrorBoundary>
        {state === 'landing' && (
          <Landing playSudoku={triggerPlay} difficulty={difficulty} setDifficulty={setDifficulty}
          options={options} setOptions={setOptions}
          theme={theme} setTheme={setTheme} />
        )}

        {state === 'sudoku' && (
          <Sudoku backToLanding={triggerBack}  difficulty={difficulty} options={options} theme={theme} />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
