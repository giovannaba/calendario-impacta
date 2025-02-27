const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cursosRoutes = require('./routes/cursosRoutes');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'calendario'
});

// Conectar ao banco antes de iniciar o servidor
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1); // Encerra o processo se a conexão falhar
    } else {
        console.log('Conectado ao banco de dados MySQL');

        // Middlewares
        app.use(cors({ origin: '*' }));
        app.use(bodyParser.json());
        app.use(helmet()); // Segurança
        app.use(morgan('dev')); // Logging

        // Middleware para tratamento de erros
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Erro interno do servidor' });
        });

        // Rotas
        app.use('/api/cursos', cursosRoutes);

        // Middleware para rota não encontrada
        app.use((req, res, next) => {
            res.status(404).json({ message: 'Rota não encontrada' });
        });

        // Iniciar o servidor
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    }
});


