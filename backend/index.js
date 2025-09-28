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

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  // AQUI: O novo usuário é criado com um array de favoritos vazio
  users.push({ name, email, password, favorites: [] });
  return res.status(201).json({ message: "Usuário criado com sucesso" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return res.json({ message: "Login realizado com sucesso", user });
  }
  return res.status(401).json({ error: "Email ou senha incorretos" });
});

// AQUI: ROTA para buscar todos os dados de um usuário, incluindo favoritos
app.get("/users", (req, res) => {
  const userEmail = req.query.email;
  const user = users.find(u => u.email === userEmail);

  if (user) {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password; // Remove a senha por segurança
    return res.json(userWithoutPassword);
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

// AQUI: ROTA para atualizar o perfil e os favoritos do usuário
app.patch("/profile", (req, res) => {
  const { email, newName, newPassword, newFavorites } = req.body;
  const user = users.find(u => u.email === email);

  if (user) {
    if (newName) user.name = newName;
    if (newPassword) user.password = newPassword;
    if (newFavorites) user.favorites = newFavorites; // Atualiza a lista de favoritos

    // Retorna o usuário atualizado (sem a senha)
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return res.json({ message: "Perfil atualizado com sucesso", user: userWithoutPassword });
  }
  return res.status(404).json({ error: "Usuário não encontrado" });
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend Spearow funcionando");
});

// WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data);
  });
});

server.listen(4000, () => console.log("Backend rodando na porta 4000"));