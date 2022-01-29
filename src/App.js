import React, { useState } from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import './App.css';

function App() {

  const [state, setState] = useState('landing');

  const triggerPlay = (...args) => {
    setState('sudoku');
  }

  const triggerBack = () => {
    setState('landing');
  }

  return(
    <div className="App">
      {state === 'landing' && (
        <Landing playSudoku={triggerPlay} />
      )}

      {state === 'sudoku' && (
        <Sudoku backToLanding={triggerBack} />
      )}
    </div>
  );
}

export default App;
