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

module.exports = router;