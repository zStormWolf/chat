const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = 'my-super-secret-chat-key';

// Para Vercel, usamos un archivo temporal diferente
const CHAT_HISTORY_FILE = '/tmp/chat_history.json';

let chatHistory = [];
let io;

// Cargar el historial de chat
try {
  if (fs.existsSync(CHAT_HISTORY_FILE)) {
    const data = fs.readFileSync(CHAT_HISTORY_FILE, 'utf8');
    chatHistory = JSON.parse(data);
  }
} catch (error) {
  console.error('Error loading chat history:', error);
}

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      const providedKey = socket.handshake.auth.token;
      if (providedKey !== SECRET_KEY) {
        console.log('Authentication failed. Disconnecting user.');
        socket.disconnect(true);
        return;
      }

      console.log('User authenticated successfully.');
      socket.emit('chat history', chatHistory);

      socket.on('chat message', (msg) => {
        console.log('Received message:', msg);
        chatHistory.push(msg);
        
        // Guardar en archivo temporal
        try {
          fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(chatHistory, null, 2));
        } catch (err) {
          console.error('Error saving chat history:', err);
        }
        
        io.emit('chat message', msg);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
