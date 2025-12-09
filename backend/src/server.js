// backend/src/server.js
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const logMiddleware = require('./middlewares/logMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(logMiddleware);

// Rotas
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API Locadora de Livros - Funcionando!' });
});

// Middleware de erro (deve ser o último)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});