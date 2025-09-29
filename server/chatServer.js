const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Lista de domínios permitidos
const allowedOrigins = [
  "https://spearow-2bi1-git-main-agas1s-projects.vercel.app", // branch main
  "https://spearow.vercel.app", // domínio fixo da Vercel
  "http://localhost:3000" // local
];

// 🔥 ADICIONE ESTA ROTA PARA O RENDER DETECTAR
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de chat WebSocket rodando!',
    status: 'online'
  });
});

// 🔥 CONFIGURAÇÃO COMPLETA DO CORS
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

// 🔥 CONFIGURAÇÃO DO SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Lista global de usuários conectados
let connectedUsers = [];

// --- Lógica do Socket.io ---
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

server.listen(PORT, () => {
    console.log(`Servidor de chat Socket.io rodando na porta ${PORT}`);
});
