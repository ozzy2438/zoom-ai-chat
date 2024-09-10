import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const chatWindowRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [savedRecordings, setSavedRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);

  const translateText = async (text, isEnglish) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, isEnglish }),
      });
      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error('Error:', error);
      return 'Translation failed';
    }
  };

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

      if (lastResult.isFinal) {
        const translation = await translateText(interimTranscript, isEnglish);
        setMessages(prevMessages => [...prevMessages, 
          { text: interimTranscript, isUser: true, isEnglish },
          { text: translation, isUser: false, isEnglish: !isEnglish }
        ]);
        setCurrentSpeech('');
      }
    };

    if (isListening && !isPaused) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, isEnglish, isPaused]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
    setIsListening(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const saveRecording = () => {
    const newRecording = {
      id: Date.now(),
      title: `Recording ${savedRecordings.length + 1}`,
      messages: [...messages]
    };
    setSavedRecordings([...savedRecordings, newRecording]);
    setMessages([]);
  };

  const viewRecording = (recording) => {
    setSelectedRecording(recording);
  };

  const closeModal = () => {
    setSelectedRecording(null);
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
          <div key={index} className={`message-container ${message.isUser ? 'user' : 'ai'}`}>
            <div className={`message ${message.isEnglish ? 'english' : 'turkish'}`}>
              <p>{message.text}</p>
            </div>
            <div className="avatar">
              <span className="material-icons">
                {message.isUser ? 'person' : 'smart_toy'}
              </span>
            </div>
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
          <span className="material-icons">mic</span>
          {isListening ? (isEnglish ? 'Stop' : 'Durdur') : (isEnglish ? 'Start' : 'Başla')}
        </button>
        {isListening && (
          <button onClick={togglePause} className={isPaused ? 'paused' : ''}>
            <span className="material-icons">{isPaused ? 'play_arrow' : 'pause'}</span>
            {isPaused ? (isEnglish ? 'Resume' : 'Devam Et') : (isEnglish ? 'Pause' : 'Duraklat')}
          </button>
        )}
        <button onClick={saveRecording} disabled={messages.length === 0}>
          <span className="material-icons">save</span>
          {isEnglish ? 'Save' : 'Kaydet'}
        </button>
      </div>
      {savedRecordings.length > 0 && (
        <div className="saved-recordings-grid">
          <h2>{isEnglish ? 'Saved Recordings' : 'Kaydedilmiş Konuşmalar'}</h2>
          <div className="recordings-grid">
            {savedRecordings.map((recording) => (
              <div key={recording.id} className="recording-card">
                <div className="card-content">
                  <h3>{recording.title}</h3>
                  <p>{recording.messages.length} messages</p>
                </div>
                <button onClick={() => viewRecording(recording)}>
                  <span className="material-icons">visibility</span>
                  {isEnglish ? 'View' : 'Görüntüle'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedRecording && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecording.title}</h2>
            <div className="modal-messages">
              {selectedRecording.messages.map((message, index) => (
                <div key={index} className={`message-container ${message.isUser ? 'user' : 'ai'}`}>
                  <div className={`message ${message.isEnglish ? 'english' : 'turkish'}`}>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="close-modal">
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  const app = React.createElement(App);
  createRoot(root).render(app);
} else {
  console.error('Root element not found');
}

export default App;