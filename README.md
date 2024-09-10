# AI-Powered Real-Time Translator

This project is an innovative, web-based application that provides real-time speech-to-speech translation between English and Turkish. Leveraging the power of OpenAI's GPT-3.5 model, it offers a seamless and interactive translation experience.

## Features

- Real-time speech recognition for both English and Turkish
- Instant translation using OpenAI's GPT-3.5 model
- Intuitive user interface with a chat-like display
- Language toggle for easy switching between English and Turkish
- Pause and resume functionality for speech recognition
- Save and view past conversations
- Responsive design for various screen sizes

## Technology Stack

- Frontend: React.js
- Backend: Node.js with Express.js
- API: OpenAI GPT-3.5
- Speech Recognition: Web Speech API
- Styling: CSS with animations
- Build Tool: Parcel

## Getting Started

### Prerequisites

- Node.js (version 16.x)
- npm (version 7.x)
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-powered-real-time-translator.git
   cd ai-powered-real-time-translator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:1234` in your browser to view the application.

## Usage

1. Click the "Start" button to begin speech recognition.
2. Speak in either English or Turkish.
3. The application will transcribe your speech and display it in the chat window.
4. The translation will appear shortly after in the opposite language.
5. Use the language toggle button to switch between English and Turkish input.
6. Click "Pause" to temporarily stop speech recognition, and "Resume" to continue.
7. Use the "Save" button to store the current conversation.
8. View saved conversations by clicking on them in the "Saved Recordings" section.

## Deployment

This application is configured for deployment on Heroku. To deploy:

1. Create a new Heroku app.
2. Set the following config vars in your Heroku app settings:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_OPTIONS`: `--max_old_space_size=1024`
3. Push your code to Heroku:
   ```
   git push heroku main
   ```

## Project Structure

- `src/App.jsx`: Main React component containing the application logic
- `src/App.css`: Styles for the application
- `src/server.js`: Express server handling API requests and serving the frontend
- `public/index.html`: HTML entry point

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- OpenAI for providing the GPT-3.5 API
- The Web Speech API for enabling speech recognition
- React and Express.js communities for their excellent documentation and resources
