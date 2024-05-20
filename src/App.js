import React, {useState} from 'react';
import './App.css';
import Chatbot from './Chatbot/Chatbot';
import VectorStorageApp from './VectorStorage/VectorStorageApp';
import VectorStorageInterface from './VectorStorage/VectorStorageInterface';

function App() {
  const [vectorStorage, setVectorStorage] = useState((vectorStorage) => new VectorStorageInterface(vectorStorage));

  return (
    <div className="App" style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
      <div style={{width: '35%', float: 'left' }}>
        <header className="VectorStorage-header">
          <h1>Vector Storage</h1>
          <p>
            Welcome to the Vector Storage App!
          </p>
          <VectorStorageApp vectorStorage={vectorStorage}/>
        </header>
      </div>
      <div style={{width: '5%', float: 'left'}}> </div>
      <div style={{ width: '55%', float: 'left' }}>
        <header className='Chatbot-header'>
          <Chatbot vectorStorage={vectorStorage}/>
        </header>
      </div>
    </div>
  );
}

export default App;
