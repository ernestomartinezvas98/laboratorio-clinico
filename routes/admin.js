const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../backend/database');
const { verificarToken, verificarRol } = require('../middleware/auth');

const router = express.Router();

// Registrar paciente (admin)
router.post('/registrar-paciente', verificarToken, verificarRol(['admin']), async (req, res) => {
  const { dui, nombres, apellidos, fecha_nacimiento, telefono, email, password, rol } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO usuarios (dui, nombres, apellidos, fecha_nacimiento, telefono, email, password, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, dui, nombres, apellidos, email, rol`,
      [dui, nombres, apellidos, fecha_nacimiento, telefono, email, hashedPassword, rol || 'paciente']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar paciente' });
  }
});

// Obtener todos los pacientes
router.get('/pacientes', verificarToken, verificarRol(['admin']), async (req, res) => {
  const { busqueda } = req.query;
  
  try {
    let query = 'SELECT id, dui, nombres, apellidos, email, telefono FROM usuarios WHERE rol = $1';
    let params = ['paciente'];
    
    if (busqueda) {
      query += ' AND (dui ILIKE $2 OR nombres ILIKE $2 OR apellidos ILIKE $2 OR email ILIKE $2)';
      params.push(`%${busqueda}%`);
    }
    
    query += ' ORDER BY nombres ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});
////////////////////

// Obtener un paciente por ID
router.get('/paciente/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, dui, nombres, apellidos, telefono, email FROM usuarios WHERE id = $1 AND rol = $2',
            [req.params.id, 'paciente']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener paciente' });
    }
});



// Actualizar paciente
router.put('/paciente/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
    const { nombres, apellidos, telefono, email } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE usuarios 
             SET nombres = $1, apellidos = $2, telefono = $3, email = $4
             WHERE id = $5 AND rol = $6
             RETURNING id, dui, nombres, apellidos, email, telefono`,
            [nombres, apellidos, telefono, email, req.params.id, 'paciente']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar paciente' });
    }
});


////////////////
// Eliminar paciente
router.delete('/pacientes/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 AND rol = $2 RETURNING *', 
      [req.params.id, 'paciente']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
});
/////////////////


// Obtener todos los exámenes
router.get('/examenes', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM catalogo_examenes ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener exámenes' });
    }
})

// Obtener un examen por ID
router.get('/examenes/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM catalogo_examenes WHERE id = $1',
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener examen' });
    }
});

// Crear examen
router.post('/examenes', verificarToken, verificarRol(['admin']), async (req, res) => {
    const { nombre, precio, tiempo_entrega } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO catalogo_examenes (nombre, precio, tiempo_entrega) VALUES ($1, $2, $3) RETURNING *',
            [nombre, precio, tiempo_entrega]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear examen' });
    }
});

// Actualizar examen
router.put('/examenes/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
    const { nombre, precio, tiempo_entrega } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE catalogo_examenes 
             SET nombre = $1, precio = $2, tiempo_entrega = $3
             WHERE id = $4
             RETURNING *`,
            [nombre, precio, tiempo_entrega, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar examen' });
    }
});

// Eliminar examen
router.delete('/examenes/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM catalogo_examenes WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        res.json({ message: 'Examen eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar examen' });
    }
});


////////////////
// Obtener todos los usuarios
router.get('/usuarios', verificarToken, verificarRol(['admin']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, dui, nombres, apellidos, email, telefono, rol FROM usuarios ORDER BY rol, nombres'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});
////////////////

// Obtener un usuario por ID
router.get('/usuarios/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  console.log('=== GET USUARIO POR ID ===');
    console.log('ID solicitado:', req.params.id);

    try {
        const result = await pool.query(
            'SELECT id, dui, nombres, apellidos, telefono, email, rol FROM usuarios WHERE id = $1',
            [req.params.id]
        );

        console.log('Resultado encontrado:', result.rows.length > 0);
        console.log('Datos:', result.rows[0]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
      console.error('Error en GET /usuarios/:id:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

////////////////
// Actualizar usuario
router.put('/usuarios/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  const { nombres, apellidos, telefono, email, rol } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombres = $1, apellidos = $2, telefono = $3, email = $4, rol = $5
       WHERE id = $6 RETURNING id, dui, nombres, apellidos, email, rol`,
      [nombres, apellidos, telefono, email, rol, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/usuarios/:id', verificarToken, verificarRol(['admin']), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


module.exports = router;