const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Configuração do pool de conexões
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'calendario',
  waitForConnections: true,
  connectionLimit: 10,  // Número de conexões simultâneas permitidas
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Endpoint de login
router.post('/login', async (req, res) => {
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

    res.json({ message: 'Login bem-sucedido', redirectTo: '/admin' });
  } catch (err) {
    console.error('Erro ao fazer login:', err.message);
    res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
  }
});



// 1. Obter todos os cursos
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute('SELECT * FROM cursos');
    connection.release();
    res.json(results);
  } catch (err) {
    console.error('Erro ao buscar cursos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar cursos: ' + err.message });
  }
});

// 2. Adicionar um novo curso
router.post('/', async (req, res) => {
  const { codigo, sigla, nome, unidade, inicio, final } = req.body;

  // Verificar se todos os campos obrigatórios foram enviados
  if (!codigo || !sigla || !nome || !unidade || !inicio || !final) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO cursos (codigo, sigla, nome, unidade, inicio, final) VALUES (?, ?, ?, ?, ?, ?)',
      [codigo, sigla, nome, unidade, inicio, final]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      codigo,
      sigla,
      nome,
      unidade,
      inicio,
      final
    });
  } catch (err) {
    console.error('Erro ao criar curso:', err.message);
    res.status(500).json({ error: 'Erro ao criar curso: ' + err.message });
  }
});

// 3. Editar um curso
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo, sigla, nome, unidade, inicio, final } = req.body;

  // Verificar se todos os campos obrigatórios foram enviados
  if (!codigo || !sigla || !nome || !unidade || !inicio || !final) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE cursos SET codigo = ?, sigla = ?, nome = ?, unidade = ?, inicio = ?, final = ? WHERE id = ?',
      [codigo, sigla, nome, unidade, inicio, final, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    res.json({
      id,
      codigo,
      sigla,
      nome,
      unidade,
      inicio,
      final
    });
  } catch (err) {
    console.error('Erro ao editar curso:', err.message);
    res.status(500).json({ error: 'Erro ao editar curso: ' + err.message });
  }
});

// 4. Excluir um curso
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM cursos WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    res.status(204).send(); // Resposta sem conteúdo
  } catch (err) {
    console.error('Erro ao excluir curso:', err.message);
    res.status(500).json({ error: 'Erro ao excluir curso: ' + err.message });
  }
});

module.exports = router;