const express = require('express');
const pool = require('../backend/database');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Agendar cita
router.post('/agendar', verificarToken, async (req, res) => {
  const { fecha, hora, motivo } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO citas (paciente_id, fecha, hora, motivo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.usuario.id, fecha, hora, motivo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agendar cita' });
  }
});

// Obtener mis citas
router.get('/mis-citas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM citas WHERE paciente_id = $1 ORDER BY fecha DESC',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// Eliminar cita
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM citas WHERE id = $1 AND paciente_id = $2 RETURNING *',
      [req.params.id, req.usuario.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

module.exports = router;