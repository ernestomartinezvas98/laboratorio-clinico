const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Importar rutas
const authRoutes = require('../routes/auth');
const pacienteRoutes = require('../routes/pacientes');
const citaRoutes = require('../routes/citas');
const examenRoutes = require('../routes/examenes');
const signosVitalesRoutes = require('../routes/signosVitales');
const adminRoutes = require('../routes/admin');
const healthExternalRoutes = require('../routes/health-external');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/signos-vitales', signosVitalesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health-external', healthExternalRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});