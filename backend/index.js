const express = require("express"); // cria servidor
const http = require("http"); // servidor básico do Node
const { Server } = require("socket.io"); // chat em tempo real
const cors = require("cors"); // libera acesso pra outros sites

const app = express();

// CORS pra aceitar só meus domínios e local
const allowedOrigins = [
  "https://spearow-2bi1-git-main-agas1s-projects.vercel.app", // preview
  "https://spearow-2bi1.vercel.app", // produção
  "http://localhost:3000" // local
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH"],
  credentials: true
}));

app.use(express.json()); // lê JSON vindo do frontend

const users = []; // "banco"

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

// rota simples pra testar
app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

// CHAAAT
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const onlineUsers = {}; // quem tá on

io.on("connection", (socket) => {
  const userName = socket.handshake.query.userName || "Anônimo";
  onlineUsers[socket.id] = userName;
  console.log(`${userName} conectado`);

  io.emit("user_connected", Object.values(onlineUsers)); // avisa todo mundo

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // envia mensagem pra todos
  });

  socket.on("disconnect", () => {
    console.log(`${userName} saiu`);
    delete onlineUsers[socket.id];
    io.emit("user_connected", Object.values(onlineUsers));
  });
});

// liga servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT} `)
);
