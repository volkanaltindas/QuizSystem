<template>
  <div>
    <h1>Quiz</h1>
    <p>{{ question }}</p>
    <ul>
      <li v-for="answer in answers" :key="answer">{{ answer }}</li>
    </ul>
    <button @click="submitAnswer(4)">Antwort: 4</button>
    <p>Letzte Antwort: {{ lastAnswer }}</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      question: '',
      answers: [],
      lastAnswer: ''
    };
  },
  async mounted() {
    // API-Daten vom Backend abrufen
    const response = await fetch('http://localhost:4000/api/quiz');
    const data = await response.json();
    this.question = data.question;
    this.answers = data.answers;

    // Mit Socket.io-Server verbinden
    this.socket = io('http://localhost:4000');

    // Neue Antworten empfangen und anzeigen
    this.socket.on('newAnswer', (data) => {
      this.lastAnswer = data;
    });
  },
  methods: {
    submitAnswer(answer) {
      // Socket.io-Nachricht an das Backend senden
      this.socket.emit('answer', answer);
    }
  },
  beforeDestroy() {
    // Socket-Verbindung schließen, wenn die Komponente zerstört wird
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>
