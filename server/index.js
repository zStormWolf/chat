console.log('Starting server...');

require('dotenv').config();
console.log('dotenv loaded.');

const express = require('express');
console.log('express loaded.');

const http = require('http');
console.log('http loaded.');

const { Server } = require('socket.io');
console.log('socket.io loaded.');

const cors = require('cors');
console.log('cors loaded.');

const app = express();
app.use(cors());
console.log('Express app created and CORS enabled.');

const server = http.createServer(app);
console.log('HTTP server created.');

const SECRET_KEY = 'my-super-secret-chat-key';

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

  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
console.log(`Port configured: ${PORT}`);

server.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

console.log('Attempting to start server...');
