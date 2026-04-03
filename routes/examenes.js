const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../backend/database');
const { verificarToken, verificarRol } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Obtener catálogo de exámenes
router.get('/catalogo', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catalogo_examenes ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener catálogo' });
  }
});

// Solicitar examen
router.post('/solicitar', verificarToken, async (req, res) => {
  const { examen_id } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO solicitud_examenes (paciente_id, examen_id)
       VALUES ($1, $2) RETURNING *`,
      [req.usuario.id, examen_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar examen' });
  }
});

// Obtener mis resultados
router.get('/mis-resultados', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.nombre as examen_nombre 
       FROM solicitud_examenes s
       JOIN catalogo_examenes c ON s.examen_id = c.id
       WHERE s.paciente_id = $1
       ORDER BY s.fecha_solicitud DESC`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
});

// Obtener solicitudes pendientes (para doctor)
router.get('/solicitudes-pendientes', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.nombres as paciente_nombre, u.apellidos as paciente_apellidos, c.nombre as examen_nombre
       FROM solicitud_examenes s
       JOIN usuarios u ON s.paciente_id = u.id
       JOIN catalogo_examenes c ON s.examen_id = c.id
       WHERE s.estado = 'pendiente'
       ORDER BY s.fecha_solicitud DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// Agregar resultado de examen
router.post('/agregar-resultado', verificarToken, verificarRol(['doctor', 'admin']), upload.single('archivo'), async (req, res) => {
  const { solicitud_id, resultado } = req.body;
  const archivo = req.file ? req.file.filename : null;
  
  try {
    await pool.query(
      `UPDATE solicitud_examenes 
       SET resultado = $1, archivo_pdf = $2, estado = 'completado'
       WHERE id = $3`,
      [resultado, archivo, solicitud_id]
    );
    res.json({ message: 'Resultado agregado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar resultado' });
  }
});

// Obtener solicitudes por paciente (para doctor)
router.get('/solicitudes-paciente/:pacienteId', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.nombre as examen_nombre 
       FROM solicitud_examenes s
       JOIN catalogo_examenes c ON s.examen_id = c.id
       WHERE s.paciente_id = $1 AND s.estado = 'pendiente'`,
      [req.params.pacienteId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// Obtener todos los exámenes del catálogo (para doctor)
router.get('/catalogo-todos', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, precio, tiempo_entrega FROM catalogo_examenes ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener catálogo:', error);
        res.status(500).json({ error: 'Error al obtener catálogo de exámenes' });
    }
});

module.exports = router;