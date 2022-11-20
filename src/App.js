import React, { useState } from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import ErrorBoundary from './components/ErrorBoundary';

import { useSelector } from 'react-redux';

import './App.css';

function App() {

  const appView = useSelector(state => state.appView.currentView);
  const [state, setState] = useState('landing');

  const [difficulty, setDifficulty] = useState(null); // string
  const [theme, setTheme] = useState('night');

  const [options, setOptions] = useState({
    timer: false,
    backlit: false,
  })

  const triggerPlay = (...args) => {
    document.documentElement.requestFullscreen();
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
        {appView === 'landing' && (
          <Landing playSudoku={triggerPlay} difficulty={difficulty} setDifficulty={setDifficulty}
          options={options} setOptions={setOptions}
          theme={theme} setTheme={setTheme} />
        )}

        {appView === 'sudoku' && (
          <Sudoku backToLanding={triggerBack}  difficulty={difficulty} options={options} theme={theme} />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
