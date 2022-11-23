import React from 'react';
import Landing from './Landing';
import Sudoku from './components/Sudoku';
import ErrorBoundary from './components/ErrorBoundary';

import { useSelector } from 'react-redux';

import './App.css';

function App() {

  const appView = useSelector(state => state.appView.currentView);

  return(
    <div className="App">
      <ErrorBoundary>
        {appView === 'landing' && (
          <Landing />
        )}

        {appView === 'sudoku' && (
          <Sudoku />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
