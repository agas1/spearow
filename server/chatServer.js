const express = require('express'); // framework para criar servidor
const http = require('http'); // servidor HTTP nativo do Node
const { Server } = require('socket.io'); // biblioteca para WebSocket
const cors = require('cors'); // para controlar quem pode acessar

const app = express(); // criando o app
const server = http.createServer(app); // criando servidor HTTP usando o express
const PORT = process.env.PORT || 5000; // porta do servidor, usa env se existir

// Lista de domínios permitidos — controla quem pode se conectar ao chat
const allowedOrigins = [
  "https://spearow-2bi1-git-main-agas1s-projects.vercel.app", // preview branch main
  "https://spearow-2bi1.vercel.app", // domínio fixo da produção (importante adicionar)
  "http://localhost:3000" // para testes locais
];

// rota simples só pra verificar se o servidor tá funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de chat WebSocket rodando!',
    status: 'online'
  });
});

// CORS: define quem pode acessar o backend
app.use(cors({
  origin: allowedOrigins, // só permite domínios na lista
  methods: ["GET", "POST"], // métodos HTTP permitidos
  credentials: true // permite cookies/credenciais
}));

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // aplica mesma regra pro socket
    methods: ["GET", "POST"], // métodos aceitos
    credentials: true
  }
});

// lista geral de usuários conectados — serve pra saber quem tá online
let connectedUsers = [];

// Lógica principal do WebSocket
io.on('connection', (socket) => {
    // pega o nome do usuário passado no handshake ou usa "Visitante"
    const userName = socket.handshake.query.userName || 'Visitante';
    console.log(`Usuário conectado: ${userName} (ID: ${socket.id})`);

    // adiciona usuário na lista
    connectedUsers.push({ userName, socketId: socket.id });

    // avisa todo mundo que alguém entrou
    io.emit("user_connected", connectedUsers);

    // envia mensagem de entrada
    io.emit("receive_message", {
        sender: "Sistema",
        content: `${userName} entrou no chat!`,
        timestamp: new Date().toLocaleTimeString()
    });

    // quando receber mensagem, retransmite pra todo mundo
    socket.on('send_message', (message) => {
        console.log(`[${userName}] Mensagem recebida: ${message.content}`);
        io.emit('receive_message', message);
    });

    // quando usuário desconectar
    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${userName} (ID: ${socket.id})`);
        
        // remove da lista
        connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
        io.emit("user_connected", connectedUsers);

        // envia mensagem de saída
        io.emit("receive_message", {
            sender: "Sistema",
            content: `${userName} saiu do chat.`,
            timestamp: new Date().toLocaleTimeString()
        });
    });
});

// inicia servidor
server.listen(PORT, () => {
    console.log(`Servidor de chat Socket.io rodando na porta ${PORT}`);
});
