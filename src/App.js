// src/App.js
import React from 'react';
import './App.css';
import Quiz from './components/Quiz';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cybersecurity Quiz</h1>
        <p>Test your knowledge of basic cybersecurity concepts</p>
      </header>
      <main>
        <Quiz />
      </main>
      <footer className="App-footer">
        <p>© 2025 Cybersecurity Project</p>
      </footer>
    </div>
  );
}

export default App;