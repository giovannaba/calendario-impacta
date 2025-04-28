const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cursosRoutes = require('./routes/cursosRoutes');
const mysql = require('mysql2');
const path = require('path'); // Para manipulação de caminhos de arquivos

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
        
        // Servir login.html
        app.get('/login', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'login.html')); // Ajuste o caminho conforme sua estrutura
        });

        // Endpoint de login (POST)
        app.post('/login', async (req, res) => {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            try {
                const connection = await db.promise().getConnection();
                const [users] = await connection.execute(
                    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
                    [email, senha] // Em produção, use hash de senha com bcrypt
                );
                connection.release();

                if (users.length === 0) {
                    return res.status(401).json({ error: 'Credenciais inválidas' });
                }

                // Aqui, normalmente você usaria JWT ou sessão.
                res.json({ message: 'Login bem-sucedido', redirectTo: '/admin' });
            } catch (err) {
                console.error('Erro ao fazer login:', err.message);
                res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
            }
        });

        // Rotas de cursos
        app.use('/api/cursos', cursosRoutes);

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
    }
});
