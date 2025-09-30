const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Domínios permitidos para acessar a API
const allowedOrigins = [
  "https://spearow-2bi1-git-main-agas1s-projects.vercel.app",
  "https://spearow-2bi1.vercel.app", 
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH"],
  credentials: true
}));

// Middleware para processar JSON das requisições
app.use(express.json());

// Array em memória para armazenar usuários (simula banco de dados)
const users = [];

// Criar nova conta de usuário
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  
  // Verifica se email já está cadastrado
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Usuário já existe" });
  }
  
  // Adiciona novo usuário com lista de favoritos vazia
  users.push({ name, email, password, favorites: [] });
  return res.status(201).json({ message: "Usuário criado" });
});

// Autenticar usuário
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    return res.json({ message: "Login OK", user });
  }
  
  return res.status(401).json({ error: "Email ou senha errados" });
});

// Buscar usuário por email
app.get("/users", (req, res) => {
  const userEmail = req.query.email;
  const user = users.find((u) => u.email === userEmail);
  
  if (user) {
    // Remove senha por segurança antes de retornar
    const copy = { ...user };
    delete copy.password;
    return res.json(copy);
  }
  
  return res.status(404).json({ error: "Usuário não encontrado" });
});

// Atualizar dados do usuário
app.patch("/profile", (req, res) => {
  const { email, newName, newPassword, newFavorites } = req.body;
  const user = users.find((u) => u.email === email);
  
  if (user) {
    // Atualiza apenas os campos fornecidos
    if (newName) user.name = newName;
    if (newPassword) user.password = newPassword;
    if (newFavorites) user.favorites = newFavorites;
    
    // Retorna usuário atualizado sem a senha
    const copy = { ...user };
    delete copy.password;
    return res.json({ message: "Perfil atualizado", user: copy });
  }
  
  return res.status(404).json({ error: "Usuário não encontrado" });
});

// Rota de health check
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

// Configuração do WebSocket para chat em tempo real
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Controla usuários online no chat
const onlineUsers = {};

// Eventos do WebSocket
io.on("connection", (socket) => {
  const userName = socket.handshake.query.userName || "Anônimo";
  onlineUsers[socket.id] = userName;
  console.log(`${userName} conectado`);

  // Notifica todos sobre usuários online
  io.emit("user_connected", Object.values(onlineUsers));

  // Recebe e retransmite mensagens
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // Remove usuário ao desconectar
  socket.on("disconnect", () => {
    console.log(`${userName} saiu`);
    delete onlineUsers[socket.id];
    io.emit("user_connected", Object.values(onlineUsers));
  });
});

// Inicia servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
);