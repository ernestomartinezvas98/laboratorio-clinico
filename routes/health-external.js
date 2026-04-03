const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');

router.get('/datos', verificarToken, async (req, res) => {
    try {
        // Datos de ejemplo para pruebas
        const datosDemo = {
            perfil: {
                nombre: "Paciente Demo",
                edad: 35,
                peso: 70.5,
                altura: 170
            },
            heart_rate: [
                { time: new Date().toISOString(), value: 72 },
                { time: new Date(Date.now() - 3600000).toISOString(), value: 85 }
            ],
            blood_pressure: [
                { time: new Date().toISOString(), systolic: 118, diastolic: 76 }
            ]
        };
        
        res.json({
            success: true,
            data: datosDemo
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

module.exports = router;