const mongoose = require("mongoose");
require("dotenv").config(); // Carregar variáveis de ambiente

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
