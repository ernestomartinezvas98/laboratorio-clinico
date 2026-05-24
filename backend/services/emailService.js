const nodemailer = require('nodemailer');
console.log('=== EMAIL SERVICE INIT ===');
console.log('EMAIL_USER cargado:', process.env.EMAIL_USER);
console.log('EMAIL_PASS cargado:', process.env.EMAIL_PASS ? 'SÍ (oculto)' : 'NO');


// Configuración del transporte de correo
// NOTA: Debes usar una cuenta de Gmail con "Contraseñas de aplicación" o tu propio SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo (ej: labatencion@gmail.com)
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
});

// Función para enviar correo de bienvenida/registro
async function enviarCorreoRegistro(email, nombre) {
    try {
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Bienvenido a LABATENCION',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">¡Bienvenido a LABATENCION!</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Tu cuenta ha sido creada exitosamente en nuestro sistema de gestión de laboratorio clínico.</p>
                    <p>Ya puedes agendar citas y solicitar exámenes desde nuestro panel de pacientes.</p>
                    <br>
                    <p>Saludos,</p>
                    <p><strong>Equipo LABATENCION</strong></p>
                </div>
            `
        });
        console.log('Correo de registro enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de registro:', error);
        return false;
    }
}

// Función para enviar correo de cita agendada
async function enviarCorreoCitaAgendada(email, nombre, fecha, hora, motivo) {
    try {
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Cita Agendada - LABATENCION',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">¡Cita Agendada!</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Tu cita ha sido agendada exitosamente con los siguientes detalles:</p>
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>📅 Fecha:</strong> ${new Date(fecha).toLocaleDateString('es-ES')}</p>
                        <p><strong>⏰ Hora:</strong> ${hora}</p>
                        <p><strong>📝 Motivo:</strong> ${motivo}</p>
                    </div>
                    <p>Por favor, llega con 10 minutos de anticipación.</p>
                    <br>
                    <p>Saludos,</p>
                    <p><strong>Equipo LABATENCION</strong></p>
                </div>
            `
        });
        console.log('Correo de cita enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de cita:', error);
        return false;
    }
}

// Función para enviar correo de resultado de examen
async function enviarCorreoResultado(email, nombre, examenNombre, fecha) {
    try {
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Resultado de Examen Disponible - LABATENCION',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">¡Resultado de Examen Disponible!</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Tu resultado de examen ya está disponible en nuestro sistema.</p>
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>🔬 Examen:</strong> ${examenNombre}</p>
                        <p><strong>📅 Fecha de resultado:</strong> ${new Date(fecha).toLocaleDateString('es-ES')}</p>
                    </div>
                    <p>Ingresa a tu panel de paciente para ver y descargar el resultado completo en PDF.</p>
                    <br>
                    <p>Saludos,</p>
                    <p><strong>Equipo LABATENCION</strong></p>
                </div>
            `
        });
        console.log('Correo de resultado enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de resultado:', error);
        return false;
    }
}

// Función para enviar correo de cancelación de cita
async function enviarCorreoCitaCancelada(email, nombre, fecha, hora) {
    try {
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Cita Cancelada - LABATENCION',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e53e3e;">Cita Cancelada</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Te informamos que tu cita ha sido cancelada:</p>
                    <div style="background: #fed7d7; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>📅 Fecha:</strong> ${new Date(fecha).toLocaleDateString('es-ES')}</p>
                        <p><strong>⏰ Hora:</strong> ${hora}</p>
                    </div>
                    <p>Si no solicitaste esta cancelación, por favor contáctanos.</p>
                    <br>
                    <p>Saludos,</p>
                    <p><strong>Equipo LABATENCION</strong></p>
                </div>
            `
        });
        console.log('Correo de cancelación enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de cancelación:', error);
        return false;
    }
}

async function enviarCorreoRecuperacion(email, nombre, token) {
        const resetLink = `http://localhost:3000/login.html?token=${token}`;    try {
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recuperación de contraseña - LABATENCION',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #667eea;">Recupera tu contraseña</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <p><a href="${resetLink}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a></p>
                    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                    <p>El enlace expirará en 1 hora.</p>
                    <br>
                    <p>Saludos,<br>Equipo LABATENCION</p>
                </div>
            `
        });
        console.log('Correo de recuperación enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de recuperación:', error);
        return false;
    }
}


module.exports = {
    enviarCorreoRegistro,
    enviarCorreoCitaAgendada,
    enviarCorreoResultado,
    enviarCorreoCitaCancelada,
    enviarCorreoRecuperacion
};