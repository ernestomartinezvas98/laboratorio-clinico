require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');

console.log('=== TEST DE CORREO ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '******** (configurada)' : 'NO CONFIGURADA');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function testEmail() {
    try {
        console.log('Intentando enviar correo a ernestomartinezvas98@gmail.com...');
        const info = await transporter.sendMail({
            from: `"LABATENCION" <${process.env.EMAIL_USER}>`,
            to: 'ernestomartinezvas98@gmail.com',
            subject: 'Test - Sistema LABATENCION',
            html: '<h2>✅ Prueba de correo exitosa</h2><p>Si ves esto, el sistema de correos funciona correctamente.</p>'
        });
        console.log('✅ Correo enviado exitosamente!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ ERROR al enviar correo:');
        console.error('Mensaje:', error.message);
    }
}

testEmail();