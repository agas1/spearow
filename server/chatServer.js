const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = 5000; // Porta do servidor de chat

// Configura o CORS para permitir conexões do seu frontend Next.js (http://localhost:3000)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// --- Lógica do Socket.io ---
io.on('connection', (socket) => {
    // Recupera o nome do usuário passado na conexão do hook useChat
    const userName = socket.handshake.query.userName || 'Visitante';
    console.log(`Usuário conectado: ${userName} (ID: ${socket.id})`);

    // 1. Ouve o evento 'send_message' (enviado pelo frontend)
    socket.on('send_message', (message) => {
        // Loga a mensagem recebida
        console.log(`[${userName}] Mensagem recebida: ${message.content}`);
        
        // 2. Transmite a mensagem para TODOS os outros sockets conectados
        // O 'emit' aqui é global. Como adicionamos a mensagem localmente no frontend,
        // não precisamos enviar de volta para o próprio remetente (usaríamos 'socket.broadcast.emit')
        // Mas para simplificar, vamos usar 'io.emit' para enviar para todos, incluindo o remetente.
        io.emit('receive_message', message);
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${userName} (ID: ${socket.id})`);
    });
});

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor de chat Socket.io rodando na porta ${PORT}`);
});