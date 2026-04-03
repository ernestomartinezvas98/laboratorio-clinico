const express = require('express');
const pool = require('../backend/database');
const { verificarToken, verificarRol } = require('../middleware/auth');

const router = express.Router();

// Registrar signos vitales
router.post('/registrar', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
  const { dui, presion_arterial, frecuencia_cardiaca, temperatura, peso, altura, observaciones } = req.body;
  
  try {
    const paciente = await pool.query('SELECT id FROM usuarios WHERE dui = $1', [dui]);
    if (paciente.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    const result = await pool.query(
      `INSERT INTO signos_vitales (paciente_id, presion_arterial, frecuencia_cardiaca, temperatura, peso, altura, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [paciente.rows[0].id, presion_arterial, frecuencia_cardiaca, temperatura, peso, altura, observaciones]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar signos vitales' });
  }
});

// Obtener mis signos vitales (paciente)
router.get('/mis-signos', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM signos_vitales WHERE paciente_id = $1 ORDER BY fecha_registro DESC LIMIT 1',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener signos vitales' });
  }
});

// Obtener todos los signos vitales (doctor)
router.get('/todos', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.nombres as paciente_nombre, u.apellidos as paciente_apellidos
       FROM signos_vitales s
       JOIN usuarios u ON s.paciente_id = u.id
       ORDER BY s.fecha_registro DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener signos vitales:', error);
    res.status(500).json({ error: 'Error al obtener signos vitales' });
  }
});

module.exports = router;