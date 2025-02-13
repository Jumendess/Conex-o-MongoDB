require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Modelo do usuário no banco de dados
const mongoose = require("mongoose");
const User = mongoose.model("User", new mongoose.Schema({
  _id: String,
  nome: String
}));

// 📌 Rota para gerar um novo ID para o usuário
app.get("/generate-id", (req, res) => {
  const userId = uuidv4();
  res.json({ user_id: userId });
});

// 📌 Rota para salvar o nome do usuário no banco
app.post("/save-user", async (req, res) => {
  const { user_id, user_name } = req.body;

  try {
    await User.findByIdAndUpdate(user_id, { nome: user_name }, { upsert: true });
    res.json({ success: true, message: "Usuário salvo com sucesso!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📌 Rota para buscar o nome do usuário pelo ID
app.get("/get-user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (user) {
      res.json({ success: true, user_name: user.nome });
    } else {
      res.json({ success: false, message: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rota para listar todos os usuários
app.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
