require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());  // Permite trabalhar com JSON
app.use(cors());          // Libera acesso externo

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// Importa autenticação
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
  

// Importa as rotas
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);  // Define o prefixo das rotas

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
