const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// CORS pra aceitar só meus domínios e local
const allowedOrigins = [
  "https://spearow-2bi1-git-main-agas1s-projects.vercel.app", // preview
  "https://spearow-2bi1.vercel.app", // produção
  "http://localhost:3000" // local
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// "Banco de dados" em memória
const users = [];

// criar conta
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Usuário já existe" });
  }
  users.push({ name, email, password, favorites: [] });
  return res.status(201).json({ message: "Usuário criado" });
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) return res.json({ message: "Login OK", user });
  return res.status(401).json({ error: "Email ou senha errados" });
});

// pegar perfil pelo email
app.get("/users", (req, res) => {
  const userEmail = req.query.email;
  const user = users.find((u) => u.email === userEmail);
  if (user) {
    const copy = { ...user };
    delete copy.password;
    return res.json(copy);
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

// atualizar perfil
app.patch("/profile", (req, res) => {
  const { email, newName, newPassword, newFavorites } = req.body;
  const user = users.find((u) => u.email === email);
  if (user) {
    if (newName) user.name = newName;
    if (newPassword) user.password = newPassword;
    if (newFavorites) user.favorites = newFavorites;
    const copy = { ...user };
    delete copy.password;
    return res.json({ message: "Perfil atualizado", user: copy });
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

// CHAT
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "OPTIONS"]
  }
});

const onlineUsers = {};

io.on("connection", (socket) => {
  const userName = socket.handshake.query.userName || "Anônimo";
  onlineUsers[socket.id] = userName;
  console.log(`${userName} conectado`);

  io.emit("user_connected", Object.values(onlineUsers));

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`${userName} saiu`);
    delete onlineUsers[socket.id];
    io.emit("user_connected", Object.values(onlineUsers));
  });
});

// Usar a porta do Render ou 4000 localmente
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
