import React from 'react';
import './App.css';
import Chatbot from './Chatbot/Chatbot';
import VectorStorageApp from './VectorStorage/VectorStorageApp';

function App() {
  return (
    <div className="App" style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
      <div style={{width: '35%', float: 'left' }}>
        <header className="VectorStorage-header">
          <h1>Vector Storage</h1>
          <p>
            Welcome to the Vector Storage App!
          </p>
          <VectorStorageApp />
        </header>
      </div>
      <div style={{width: '5%', float: 'left'}}> </div>
      <div style={{ width: '55%', float: 'left' }}>
        <header className='Chatbot-header'>
          <Chatbot />
        </header>
      </div>
    </div>
  );
}

export default App;
