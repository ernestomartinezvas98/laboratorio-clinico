const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../backend/database');
const { SECRET_KEY } = require('../middleware/auth');

const router = express.Router();

//Registro de usuario
router.post('/registro', async (req, res) => {
  const { dui, nombres, apellidos, fecha_nacimiento, telefono, email, password, rol } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (dui, nombres, apellidos, fecha_nacimiento, telefono, email, password, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, dui, nombres, apellidos, email, rol
    `;

    const result = await pool.query(query, [
      dui, nombres, apellidos, fecha_nacimiento, telefono, email, hashedPassword, rol || 'paciente'
    ]);

    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

//Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('=== INICIO LOGIN ===');
  console.log('Email:', email);
  console.log('Password:', password);
  
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('Usuario encontrado?', result.rows.length > 0);
    
    if (result.rows.length === 0) {
      console.log('Usuario NO encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const usuario = result.rows[0];
    console.log('Hash en BD:', usuario.password);
    
    const validPassword = await bcrypt.compare(password, usuario.password);
    console.log('Contraseña válida?', validPassword);
    
    if (!validPassword) {
      console.log('Contraseña INCORRECTA');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log('Login exitoso para:', email);
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, nombres: usuario.nombres, apellidos: usuario.apellidos,},
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      usuario: {
        id: usuario.id,
        dui: usuario.dui,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

//Recuperar contraseña
router.post('/recuperar-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email no registrado' });
    }
    
    //Se enviaria un correo con instrucciones
    res.json({ message: 'Se han enviado instrucciones a tu correo electrónico' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

module.exports = router;