const express = require('express');
const pool = require('../backend/database');
const { verificarToken } = require('../middleware/auth');
const { enviarCorreoCitaAgendada, enviarCorreoCitaCancelada } = require('../backend/services/emailService');
const router = express.Router();

//Agendar cita
router.post('/agendar', verificarToken, async (req, res) => {
  const { fecha, hora, motivo } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO citas (paciente_id, fecha, hora, motivo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.usuario.id, fecha, hora, motivo]
    );

     // Obtener datos del paciente para enviar correo
    const paciente = await pool.query(
      'SELECT email, nombres FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    
    // Enviar correo de confirmación (no bloquear si falla)
    enviarCorreoCitaAgendada(
      paciente.rows[0].email,
      paciente.rows[0].nombres,
      fecha,
      hora,
      motivo
    ).catch(console.error);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agendar cita' });
  }
});

//Obtener mis citas
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

//Eliminar cita
router.delete('/:id', verificarToken, async (req, res) => {
  try {

    // Obtener datos de la cita antes de eliminarla
    const cita = await pool.query(
      'SELECT c.*, u.email, u.nombres FROM citas c JOIN usuarios u ON c.paciente_id = u.id WHERE c.id = $1 AND c.paciente_id = $2',
      [req.params.id, req.usuario.id]
    );

    const result = await pool.query(
      'DELETE FROM citas WHERE id = $1 AND paciente_id = $2 RETURNING *',
      [req.params.id, req.usuario.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    
    // Enviar correo de cancelación
    if (cita.rows.length > 0) {
      enviarCorreoCitaCancelada(
        cita.rows[0].email,
        cita.rows[0].nombres,
        cita.rows[0].fecha,
        cita.rows[0].hora
      ).catch(console.error);
    }

    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

module.exports = router;