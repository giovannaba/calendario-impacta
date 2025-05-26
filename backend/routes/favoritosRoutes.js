const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'calendario'
};

const pool = mysql.createPool(dbConfig);

// GET: listar todos os cursos favoritados
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [favoritos] = await conn.execute(`
      SELECT cursos.* FROM favoritos
      JOIN cursos ON favoritos.curso_id = cursos.id
    `);
    conn.release();
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos: ' + err.message });
  }
});

// POST: adicionar favorito
router.post('/', async (req, res) => {
  const { curso_id } = req.body;

  if (!curso_id) {
    return res.status(400).json({ error: 'curso_id é obrigatório.' });
  }

  try {
    const conn = await pool.getConnection();

    // Verifica se já está favoritado
    const [exist] = await conn.execute('SELECT * FROM favoritos WHERE curso_id = ?', [curso_id]);
    if (exist.length > 0) {
      conn.release();
      return res.status(409).json({ error: 'Curso já está favoritado.' });
    }

    await conn.execute('INSERT INTO favoritos (curso_id) VALUES (?)', [curso_id]);
    conn.release();
    res.status(201).json({ message: 'Curso favoritado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao favoritar: ' + err.message });
  }
});

// DELETE: remover favorito
router.delete('/:curso_id', async (req, res) => {
  const { curso_id } = req.params;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute('DELETE FROM favoritos WHERE curso_id = ?', [curso_id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Favorito não encontrado.' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover favorito: ' + err.message });
  }
});

module.exports = router;
