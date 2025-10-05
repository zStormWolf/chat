console.log('Starting server...');

require('dotenv').config();
console.log('dotenv loaded.');

const express = require('express');
console.log('express loaded.');

const http = require('http');
console.log('http loaded.');

const { Server } = require('socket.io');
const fs = require('fs');
console.log('socket.io loaded.');

const cors = require('cors');
console.log('cors loaded.');

const app = express();
app.use(cors());
console.log('Express app created and CORS enabled.');

const server = http.createServer(app);
console.log('HTTP server created.');

const SECRET_KEY = 'my-super-secret-chat-key';
const CHAT_HISTORY_FILE = './chat_history.json';

// Cargar el historial de chat o inicializarlo si no existe
let chatHistory = [];
try {
  if (fs.existsSync(CHAT_HISTORY_FILE)) {
    const data = fs.readFileSync(CHAT_HISTORY_FILE, 'utf8');
    chatHistory = JSON.parse(data);
    console.log('Chat history loaded.');
  }
} catch (error) {
  console.error('Error loading chat history:', error);
}

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});
console.log('Socket.io server created.');

io.on('connection', (socket) => {
  console.log('A user connected');

  const providedKey = socket.handshake.auth.token;
  if (providedKey !== SECRET_KEY) {
    console.log('Authentication failed. Disconnecting user.');
    socket.disconnect(true);
    return;
  }

  console.log('User authenticated successfully.');

    // Enviar el historial de chat al usuario recién conectado
    socket.emit('chat history', chatHistory);

  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    chatHistory.push(msg);
    fs.writeFile(CHAT_HISTORY_FILE, JSON.stringify(chatHistory, null, 2), (err) => {
      if (err) console.error('Error saving chat history:', err);
    });
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
console.log(`Port configured: ${PORT}`);

// Para Vercel, exportamos el servidor como una función
if (process.env.VERCEL) {
  module.exports = server;
} else {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on port ${PORT} on all interfaces`);
  });
}

console.log('Attempting to start server...');
