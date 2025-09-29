const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Banco de dados em memória
const users = [];

// Rotas de login e registro
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  users.push({ name, email, password, favorites: [] });
  return res.status(201).json({ message: "Usuário criado com sucesso" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    return res.json({ message: "Login realizado com sucesso", user });
  }
  return res.status(401).json({ error: "Email ou senha incorretos" });
});

app.get("/users", (req, res) => {
  const userEmail = req.query.email;
  const user = users.find((u) => u.email === userEmail);

  if (user) {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return res.json(userWithoutPassword);
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

app.patch("/profile", (req, res) => {
  const { email, newName, newPassword, newFavorites } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    if (newName) user.name = newName;
    if (newPassword) user.password = newPassword;
    if (newFavorites) user.favorites = newFavorites;

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return res.json({
      message: "Perfil atualizado com sucesso",
      user: userWithoutPassword,
    });
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

app.get("/", (req, res) => {
  res.send("Backend Spearow funcionando");
});

// --- WEBSOCKET (CHAT) ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Guardar usuários online
const onlineUsers = {};

io.on("connection", (socket) => {
  const userName = socket.handshake.query.userName || "Anônimo";
  onlineUsers[socket.id] = userName;

  console.log(`${userName} conectado (${socket.id})`);

  // Envia lista de usuários online
  io.emit("user_connected", Object.values(onlineUsers));

  // Receber e repassar mensagens
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // Quando desconectar
  socket.on("disconnect", () => {
    console.log(`${userName} desconectou (${socket.id})`);
    delete onlineUsers[socket.id];
    io.emit("user_connected", Object.values(onlineUsers));
  });
});

server.listen(4000, () =>
  console.log("Backend + Chat rodando na porta 4000 🚀")
);
