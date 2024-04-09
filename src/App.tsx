import React from 'react';
import './App.css';
import UserProfile from './UserProfile';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <UserProfile /> {/* Додали компонент UserProfile */}
        </header>
      </div>
  );
}

export default App;