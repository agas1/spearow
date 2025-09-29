const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// 🔥 ADICIONE ESTA ROTA PARA O RENDER DETECTAR
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de chat WebSocket rodando!',
    status: 'online'
  });
});

// 🔥 CONFIGURAÇÃO COMPLETA DO CORS
app.use(cors({
  origin: [
    "https://spearow-2bi1-er3tnxcw6-agas1s-projects.vercel.app",
    "https://spearow.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// 🔥 ATUALIZE A CONFIGURAÇÃO DO SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: [
      "https://spearow-2bi1-er3tnxcw6-agas1s-projects.vercel.app",
      "https://spearow.vercel.app", 
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Lista global de usuários conectados
let connectedUsers = [];

// --- Lógica do Socket.io (MANTENHA SEU CÓDIGO) ---
io.on('connection', (socket) => {
    const userName = socket.handshake.query.userName || 'Visitante';
    console.log(`Usuário conectado: ${userName} (ID: ${socket.id})`);

    connectedUsers.push({ userName, socketId: socket.id });
    io.emit("user_connected", connectedUsers);

    io.emit("receive_message", {
        sender: "Sistema",
        content: `${userName} entrou no chat!`,
        timestamp: new Date().toLocaleTimeString()
    });

    socket.on('send_message', (message) => {
        console.log(`[${userName}] Mensagem recebida: ${message.content}`);
        io.emit('receive_message', message);
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${userName} (ID: ${socket.id})`);
        connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
        io.emit("user_connected", connectedUsers);
        
        io.emit("receive_message", {
            sender: "Sistema",
            content: `${userName} saiu do chat.`,
            timestamp: new Date().toLocaleTimeString()
        });
    });
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Servidor de chat Socket.io rodando na porta ${process.env.PORT || 5000}`);
});