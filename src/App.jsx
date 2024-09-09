import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css'; // CSS dosyasını import ediyoruz

function App() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const chatWindowRef = useRef(null);
  const [lastTranslationTime, setLastTranslationTime] = useState(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = isEnglish ? 'en-US' : 'tr-TR';

    recognition.onresult = async (event) => {
      const lastResult = event.results[event.results.length - 1];
      const interimTranscript = lastResult[0].transcript;
      setCurrentSpeech(interimTranscript);

      if (lastResult.isFinal && Date.now() - lastTranslationTime > 2000) {
        try {
          const response = await axios.post('/translate', {
            text: interimTranscript,
            isEnglish,
          });
          
          setMessages(prevMessages => [...prevMessages, { 
            original: interimTranscript, 
            translated: response.data.translation,
            fromEnglish: isEnglish
          }]);
          setCurrentSpeech('');
          setLastTranslationTime(Date.now());
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, isEnglish, lastTranslationTime]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
    setIsListening(false); // Stop listening when switching languages
  };

  return (
    <div className="App">
      <div className="background-animation"></div>
      <header className="App-header">
        <h1>AI Powered Real-Time Translator</h1>
      </header>
      <div className="language-toggle">
        <button onClick={toggleLanguage} className={isEnglish ? 'active' : ''}>
          {isEnglish ? 'Switch to Turkish' : 'İngilizce\'ye geç'}
        </button>
      </div>
      <div className="chat-container" ref={chatWindowRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.fromEnglish ? 'from-english' : 'from-turkish'}`}>
            <p className="original">{message.original}</p>
            <p className="translated">{message.translated}</p>
          </div>
        ))}
        {currentSpeech && (
          <div className="current-speech">
            <p>{currentSpeech}</p>
          </div>
        )}
      </div>
      <div className="controls">
        <button onClick={() => setIsListening(!isListening)} className={isListening ? 'listening' : ''}>
          {isListening ? (isEnglish ? 'Stop Listening' : 'Dinlemeyi Durdur') : (isEnglish ? 'Start Listening' : 'Dinlemeye Başla')}
        </button>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
} else {
  console.error('Root element not found');
}

export default App;