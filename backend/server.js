const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Express App erstellen
const app = express();
const port = 4000; // Backend auf Port 4000

// CORS aktivieren
app.use(cors({
  origin: 'http://localhost:3000', // Erlaubt Anfragen vom Nuxt.js-Frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// HTTP-Server erstellen
const server = http.createServer(app);

// Socket.io initialisieren und mit dem HTTP-Server verbinden
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Erlaubt Socket-Verbindungen vom Nuxt.js-Frontend
    methods: ['GET', 'POST']
  }
});

// Eine einfache API-Route für das Quiz
app.get('/api/quiz', (req, res) => {
  res.json({ question: 'What is 2 + 2?', answers: [2, 3, 4, 5] });
});

// Socket.io-Verbindung handhaben
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id); // Zeigt die Socket-ID des verbundenen Benutzers

  socket.on('answer', (data) => {
    console.log('Answer received from client:', data); // Ausgabe der empfangenen Antwort
    io.emit('newAnswer', data); // Nachricht an alle Clients senden
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id); // Zeigt an, wenn der Benutzer die Verbindung trennt
  });
});


// Den Server starten
server.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});
