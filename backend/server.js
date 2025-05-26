const express = require('express');
const cors = require('cors');
const cursosRoutes = require('./routes/cursosRoutes');
const loginRoutes = require('./routes/loginRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json()); // Em vez de body-parser

// Rotas
app.use('/api/cursos', cursosRoutes); // Cursos vão ser acessados em /api/cursos
app.use('/', loginRoutes);             // Login vai ser acessado em /login
app.use('/api/favoritos', favoritosRoutes); //favoritos

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// Middleware para rota não encontrada
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
