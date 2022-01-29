import React, { useState } from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import './App.css';

function App() {

  const [state, setState] = useState('landing');

  const [difficulty, setDifficulty] = useState(null); // string
  //const [timer, setTimer] = useState(false);
  //const [counter, setCounter] = useState(false);
  const [theme, setTheme] = useState('night');

  const [options, setOptions] = useState({
    timer: false,
    counter: false,
  })

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
        options={options} setOptions={setOptions}
        theme={theme} setTheme={setTheme} />
      )}

      {state === 'sudoku' && (
        <Sudoku backToLanding={triggerBack}  difficulty={difficulty} options={options} theme={theme} />
      )}
    </div>
  );
}

export default App;
