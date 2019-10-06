import React from 'react';
import logo from './logo.svg';
import './App.css';

import { findMainAreas } from './api/phenotypes';

function App() {
  const [text, setText] = React.useState('');

  findMainAreas().then((areas) => {
    setText(areas);
  })
    .catch((e) => {
      console.log('Error : ', e);
    });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
          {text}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
