const express = require("express");
const mysql = require("mysql2");

const routes = express.Router();

// Cria a conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'calendario'
});

// Conecta ao banco
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

// Endpoint de login
routes.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Consulta o banco para encontrar o usuário
    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ error: 'Erro no servidor.' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ error: 'Email ou senha incorretos.' });
        }
    });
});

module.exports = routes;