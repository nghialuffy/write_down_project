import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {BaseButton} from './component';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <BaseButton type='primary'>Primary</BaseButton>
        <BaseButton>Default</BaseButton>
        <BaseButton type='danger'>Danger</BaseButton>
      </header>
    </div>
  );
}

export default App;
