const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = 5000; // Porta do servidor de chat

// Configuração do CORS para permitir conexões do frontend
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Lista global de usuários conectados
let connectedUsers = [];

// --- Lógica do Socket.io ---
io.on('connection', (socket) => {
    // Recupera o nome do usuário passado na conexão
    const userName = socket.handshake.query.userName || 'Visitante';
    console.log(`Usuário conectado: ${userName} (ID: ${socket.id})`);

    // Adiciona o usuário à lista de conectados
    connectedUsers.push({ userName, socketId: socket.id });

    // Envia a lista atualizada de usuários conectados para todos
    io.emit("user_connected", connectedUsers);

    // Mensagem automática de boas-vindas no chat
    io.emit("receive_message", {
        sender: "Sistema",
        content: `${userName} entrou no chat!`,
        timestamp: new Date().toLocaleTimeString()
    });

    // Evento para receber mensagens enviadas pelo cliente
    socket.on('send_message', (message) => {
        console.log(`[${userName}] Mensagem recebida: ${message.content}`);
        io.emit('receive_message', message);
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${userName} (ID: ${socket.id})`);
        connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);

        // Atualiza lista de usuários para todos
        io.emit("user_connected", connectedUsers);

        // Mensagem automática de saída
        io.emit("receive_message", {
            sender: "Sistema",
            content: `${userName} saiu do chat.`,
            timestamp: new Date().toLocaleTimeString()
        });
    });
});

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor de chat Socket.io rodando na porta ${PORT}`);
});
