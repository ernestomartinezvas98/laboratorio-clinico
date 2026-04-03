const express = require('express');
const pool = require('../backend/database');
const { verificarToken, verificarRol } = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del paciente
router.get('/mi-perfil', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, dui, nombres, apellidos, fecha_nacimiento, telefono, email, rol FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Buscar paciente por DUI
router.get('/buscar/:dui', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, dui, nombres, apellidos, telefono, email FROM usuarios WHERE dui = $1',
      [req.params.dui]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
});

// Obtener historial clínico del paciente
router.get('/mi-historial', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM historial_clinico WHERE paciente_id = $1 ORDER BY created_at DESC',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// Registrar historial clínico
router.post('/registrar-historial', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
  const { dui, enfermedad, fecha_inicio, intensidad, factores_alivio, factores_empeoran } = req.body;
  
  try {
    const paciente = await pool.query('SELECT id FROM usuarios WHERE dui = $1', [dui]);
    if (paciente.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    const result = await pool.query(
      `INSERT INTO historial_clinico (paciente_id, enfermedad, fecha_inicio, intensidad, factores_alivio, factores_empeoran)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [paciente.rows[0].id, enfermedad, fecha_inicio, intensidad, factores_alivio, factores_empeoran]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar historial' });
  }
});

// Obtener contacto de emergencia
router.get('/mi-contacto-emergencia', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contactos_emergencia WHERE paciente_id = $1',
      [req.usuario.id]
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contacto' });
  }
});

module.exports = router;