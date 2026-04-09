const PDFDocument = require('pdfkit');
const fs = require('fs');
const express = require('express');

const path = require('path');
const pool = require('../backend/database');
const { verificarToken, verificarRol } = require('../middleware/auth');

const router = express.Router();

//FUNCION PARA GENERAR PDF
function generarPDFResultado(pacienteNombre, examenNombre, resultado, fecha, doctorNombre) {
    return new Promise((resolve, reject) => {
        const fileName = `resultado_${Date.now()}.pdf`;
        const projectRoot = 'C:\\Users\\Martrinez\\Desktop\\S.D lab\\laboratorio-clinico';
        const uploadDir = path.join(projectRoot, 'uploads');
        const filePath = path.join(uploadDir, fileName);
        const logoPath = path.join(uploadDir, 'logo.png');

        console.log('Generando PDF en:', filePath);
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        
        doc.pipe(stream);
        
        //Encabezado con logo
        if (fs.existsSync(logoPath)) {
            const logoWidth = 80;
            const centerX = (doc.page.width - logoWidth) / 2;
            doc.image(logoPath, centerX, 40, { width: logoWidth });
            doc.moveDown(3);
            doc.fontSize(20).font('Helvetica-Bold').text('LABORATORIO CLÍNICO', { align: 'center' });
        } else {
            doc.fontSize(24).font('Helvetica-Bold').text('LABORATORIO CLÍNICO', { align: 'center' });
        }
        
        doc.moveDown(0.5);
        doc.fontSize(14).font('Helvetica').text('Resultado de Examen', { align: 'center' });
        doc.moveDown();
        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, 140).lineTo(550, 140).stroke();
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text('DATOS DEL PACIENTE', { underline: true });
        doc.fontSize(11).font('Helvetica');
        doc.text(`Nombre: ${pacienteNombre}`);
        doc.text(`Fecha de emisión: ${fecha}`);
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica-Bold').text('EXAMEN SOLICITADO', { underline: true });
        doc.fontSize(11).font('Helvetica');
        doc.text(`Tipo de examen: ${examenNombre}`);
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica-Bold').text('RESULTADOS', { underline: true });
        doc.fontSize(11).font('Helvetica');
        
        const lineas = resultado.split('\n');
        lineas.forEach(linea => {
            doc.text(`• ${linea}`);
        });
        
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica-Bold').text('OBSERVACIONES', { underline: true });
        doc.fontSize(11).font('Helvetica');
        doc.text('Los resultados deben ser interpretados por su médico tratante.');
        doc.moveDown();
        
        doc.moveDown(4);
        doc.fontSize(11).font('Helvetica');
        doc.moveDown(0.5);
        doc.text('_______________', { align: 'right' });
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text(`${doctorNombre || 'Médico Especialista'}`, { align: 'right' });
        doc.fontSize(11).font('Helvetica');
        doc.text('Laboratorio Clínico', { align: 'right' });
        
        doc.moveDown();
        doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, 700).lineTo(550, 700).stroke();
        doc.fontSize(8).text('Este documento es una prueba y no reemplaza una consulta médica.', 50, 720, { align: 'center' });
        
        doc.end();
        
        stream.on('finish', () => {
            console.log('PDF creado exitosamente:', fileName);
            resolve(fileName);
        });
        stream.on('error', (err) => {
            console.error('Error al crear PDF:', err);
            reject(err);
        });
    });
}

//RUTAS DE EXAMENES

//Obtener catalogo de examenes
router.get('/catalogo', verificarToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM catalogo_examenes ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener catálogo' });
    }
});

//Solicitar examen
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

//Obtener mis resultados (paciente)
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

//Obtener solicitudes pendientes (para doctor)
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

//Obtener detalles de una solicitud especifica (para procesar)
router.get('/solicitud/:id', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.id, s.paciente_id, s.examen_id, s.estado,
                    u.dui as paciente_dui, u.nombres as paciente_nombre, 
                    u.apellidos as paciente_apellidos, u.email as paciente_email,
                    c.nombre as examen_nombre
             FROM solicitud_examenes s
             JOIN usuarios u ON s.paciente_id = u.id
             JOIN catalogo_examenes c ON s.examen_id = c.id
             WHERE s.id = $1`,
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener solicitud' });
    }
});

//Obtener solicitudes por paciente (para doctor)
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

// Doctor sube resultado (el sistema genera el PDF)
router.post('/subir-resultado-doctor', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
    const { dui, examen_id, resultado } = req.body;
    
    console.log('=== DATOS DEL TOKEN ===');
    console.log('Usuario completo:', req.usuario);
    console.log('Nombres:', req.usuario.nombres);
    console.log('Apellidos:', req.usuario.apellidos);
    
    let doctorNombre = '';
    if (req.usuario.nombres && req.usuario.apellidos) {
        doctorNombre = `${req.usuario.nombres} ${req.usuario.apellidos}`;
    } else if (req.usuario.nombres) {
        doctorNombre = req.usuario.nombres;
    } else if (req.usuario.email) {
        doctorNombre = req.usuario.email.split('@')[0];
    } else {
        doctorNombre = 'Médico Especialista';
    }
    
    console.log('Doctor nombre final:', doctorNombre);

    try {
        const paciente = await pool.query('SELECT id, nombres, apellidos FROM usuarios WHERE dui = $1', [dui]);
        if (paciente.rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
        const examen = await pool.query('SELECT nombre FROM catalogo_examenes WHERE id = $1', [examen_id]);
        if (examen.rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }
        
        const pacienteNombre = `${paciente.rows[0].nombres} ${paciente.rows[0].apellidos}`;
        const examenNombre = examen.rows[0].nombre;
        const fecha = new Date().toLocaleDateString('es-ES');
        
        console.log('Generando PDF para:', pacienteNombre);
        
        const archivoPDF = await generarPDFResultado(pacienteNombre, examenNombre, resultado, fecha, doctorNombre);
        console.log('PDF generado:', archivoPDF);
        
        await pool.query(
            `INSERT INTO solicitud_examenes (paciente_id, examen_id, resultado, archivo_pdf, estado)
             VALUES ($1, $2, $3, $4, 'completado')`,
            [paciente.rows[0].id, examen_id, resultado, archivoPDF]
        );
        
        console.log('Guardado exitoso');
        
        res.json({ 
            message: 'Resultado generado y guardado exitosamente',
            pdf: archivoPDF
        });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ error: 'Error al generar resultado: ' + error.message });
    }
});

//Completar una solicitud pendiente (actualiza estado)
router.post('/completar-solicitud/:id', verificarToken, verificarRol(['doctor', 'admin']), async (req, res) => {
    const { resultado, archivo_pdf } = req.body;
    const solicitudId = req.params.id;
    
    try {
        //Obtener la solicitud para el paciente y examen
        const solicitud = await pool.query(
            'SELECT paciente_id, examen_id FROM solicitud_examenes WHERE id = $1',
            [solicitudId]
        );
        
        if (solicitud.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        
        //Obtener datos del paciente y examen para generar PDF
        const paciente = await pool.query('SELECT nombres, apellidos FROM usuarios WHERE id = $1', [solicitud.rows[0].paciente_id]);
        const examen = await pool.query('SELECT nombre FROM catalogo_examenes WHERE id = $1', [solicitud.rows[0].examen_id]);
        
        const pacienteNombre = `${paciente.rows[0].nombres} ${paciente.rows[0].apellidos}`;
        const examenNombre = examen.rows[0].nombre;
        const fecha = new Date().toLocaleDateString('es-ES');
        
        //Obtener nombre del doctor
        let doctorNombre = '';
        if (req.usuario.nombres && req.usuario.apellidos) {
            doctorNombre = `${req.usuario.nombres} ${req.usuario.apellidos}`;
        } else {
            doctorNombre = 'Médico Especialista';
        }
        
        //Generar PDF
        const archivoPDF = await generarPDFResultado(pacienteNombre, examenNombre, resultado, fecha, doctorNombre);
        
        //Actualizar la solicitud pendiente
        await pool.query(
            `UPDATE solicitud_examenes 
             SET resultado = $1, archivo_pdf = $2, estado = 'completado'
             WHERE id = $3`,
            [resultado, archivoPDF, solicitudId]
        );
        
        res.json({ message: 'Solicitud completada exitosamente', pdf: archivoPDF });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al completar solicitud' });
    }
});

module.exports = router;