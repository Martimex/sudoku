import React, { useState } from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import './App.css';

function App() {

  const [state, setState] = useState('landing');

  const [difficulty, setDifficulty] = useState(null); // string
  const [timer, setTimer] = useState(false);
  const [counter, setCounter] = useState(false);
  const [theme, setTheme] = useState('night');

  const triggerPlay = (...args) => {
    setState('sudoku');
  }

  const triggerBack = () => {
    setState('landing');
  }

  return(
    <div className="App">
      {state === 'landing' && (
        <Landing playSudoku={triggerPlay} difficulty={difficulty} setDifficulty={setDifficulty}
        timer={timer} setTimer={setTimer} counter={counter} setCounter={setCounter}
        theme={theme} setTheme={setTheme} />
      )}

      {state === 'sudoku' && (
        <Sudoku backToLanding={triggerBack}  difficulty={difficulty} timer={timer} counter={counter} theme={theme} />
      )}
    </div>
  );
}

export default App;
