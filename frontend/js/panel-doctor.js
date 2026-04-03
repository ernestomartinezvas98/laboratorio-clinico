const API_URL = 'http://localhost:3000/api';

// Verificar autenticación
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token || usuario.rol !== 'doctor') {
    window.location.href = 'login.html';
}

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
        });
        document.getElementById(`tab-${tabId}`).classList.add('active');
        btn.classList.add('active');
        
        if (tabId === 'resultados') cargarSolicitudesPendientes();
        if (tabId === 'signos') cargarHistorialSignos();
    });
});

// Buscar paciente para signos vitales
document.getElementById('buscarPacienteSignos').addEventListener('click', async () => {
    const dui = document.getElementById('signosDui').value;
    if (!dui) {
        alert('Ingrese el DUI del paciente');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/pacientes/buscar/${dui}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('infoPacienteSignos').innerHTML = `
                <div class="paciente-info">
                    <p><strong>${data.nombres} ${data.apellidos}</strong></p>
                    <p>DUI: ${data.dui} | Tel: ${data.telefono}</p>
                </div>
            `;
        } else {
            alert('Paciente no encontrado');
            document.getElementById('infoPacienteSignos').innerHTML = '';
        }
    } catch (error) {
        alert('Error al buscar paciente');
    }
});

// Registrar signos vitales
document.getElementById('registrarSignosForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dui = document.getElementById('signosDui').value;
    const signosData = {
        dui,
        presion_arterial: document.getElementById('presionArterial').value,
        frecuencia_cardiaca: parseInt(document.getElementById('frecuenciaCardiaca').value),
        temperatura: parseFloat(document.getElementById('temperatura').value),
        peso: parseFloat(document.getElementById('peso').value),
        altura: parseFloat(document.getElementById('altura').value),
        observaciones: document.getElementById('observaciones').value
    };
    
    try {
        const response = await fetch(`${API_URL}/signos-vitales/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(signosData)
        });
        
        if (response.ok) {
            alert('Signos vitales registrados exitosamente');
            document.getElementById('registrarSignosForm').reset();
            document.getElementById('infoPacienteSignos').innerHTML = '';
            cargarHistorialSignos();
        } else {
            const data = await response.json();
            alert(data.error || 'Error al registrar signos vitales');
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Cargar historial de signos vitales 
async function cargarHistorialSignos() {
    try {
        const response = await fetch(`${API_URL}/signos-vitales/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok && data.length > 0) {
            let html = `
                <table class="tabla-signos">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Presión Arterial</th>
                            <th>Frecuencia Cardíaca</th>
                            <th>Temperatura</th>
                            <th>Peso</th>
                            <th>Altura</th>
                            <th>Observaciones</th>
                            <th>Fecha</th>
                        </thead>
                    <tbody>
            `;
            data.forEach(signo => {
                html += `
                    <tr>
                        <td>${signo.paciente_nombre} ${signo.paciente_apellidos}</td>
                        <td>${signo.presion_arterial || '-'}</td>
                        <td>${signo.frecuencia_cardiaca || '-'}</td>
                        <td>${signo.temperatura || '-'} °C</td>
                        <td>${signo.peso || '-'} kg</td>
                        <td>${signo.altura || '-'} cm</td>
                        <td style="max-width: 200px; word-wrap: break-word;">${signo.observaciones || '-'}</td>
                        <td>${new Date(signo.fecha_registro).toLocaleString()}</td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            document.getElementById('historialSignos').innerHTML = html;
        } else {
            document.getElementById('historialSignos').innerHTML = '<p>No hay registros de signos vitales</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('historialSignos').innerHTML = '<p style="color: red;">Error al cargar los datos</p>';
    }
}

// Buscar paciente para resultados
document.getElementById('buscarPacienteResultados').addEventListener('click', async () => {
    const dui = document.getElementById('resultadoDui').value;
    if (!dui) {
        alert('Ingrese el DUI del paciente');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/pacientes/buscar/${dui}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('infoPacienteResultados').innerHTML = `
                <div class="paciente-info">
                    <p><strong>${data.nombres} ${data.apellidos}</strong></p>
                    <p>DUI: ${data.dui} | Email: ${data.email}</p>
                </div>
            `;
            cargarCatalogoExamenes();
        } else {
            alert('Paciente no encontrado');
            document.getElementById('infoPacienteResultados').innerHTML = '';
        }
    } catch (error) {
        alert('Error al buscar paciente');
    }
});

// Cargar exámenes del paciente
async function cargarExamenesPaciente(pacienteId) {
    try {
        const response = await fetch(`${API_URL}/examenes/solicitudes-paciente/${pacienteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const select = document.getElementById('examenSeleccionado');
        select.innerHTML = '<option value="">Seleccionar Examen</option>';
        data.forEach(solicitud => {
            select.innerHTML += `<option value="${solicitud.id}">${solicitud.examen_nombre} - Solicitado: ${new Date(solicitud.fecha_solicitud).toLocaleDateString()}</option>`;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar catálogo de exámenes para seleccionar
async function cargarCatalogoExamenes() {
    try {
        const response = await fetch(`${API_URL}/examenes/catalogo`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const select = document.getElementById('examenSeleccionado');
        if (data && data.length > 0) {
            select.innerHTML = '<option value="">Seleccionar Examen</option>';
            data.forEach(examen => {
                select.innerHTML += `<option value="${examen.id}">${examen.nombre} - $${examen.precio} (${examen.tiempo_entrega})</option>`;
            });
        } else {
            select.innerHTML = '<option value="">No hay exámenes disponibles</option>';
        }
    } catch (error) {
        console.error('Error al cargar catálogo:', error);
        const select = document.getElementById('examenSeleccionado');
        select.innerHTML = '<option value="">Error al cargar exámenes</option>';
    }
}

// Cargar solicitudes pendientes
async function cargarSolicitudesPendientes() {
    try {
        const response = await fetch(`${API_URL}/examenes/solicitudes-pendientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok && data.length > 0) {
            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Examen</th>
                            <th>Fecha Solicitud</th>
                            <th>Acción</th>
                        </thead>
                    <tbody>
            `;
            data.forEach(solicitud => {
                html += `
                    <tr>
                        <td>${solicitud.paciente_nombre}</td>
                        <td>${solicitud.examen_nombre}</td>
                        <td>${new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                        <td><button onclick="procesarSolicitud(${solicitud.id})" class="btn-primary">Procesar</button></td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
            document.getElementById('solicitudesPendientes').innerHTML = html;
        } else {
            document.getElementById('solicitudesPendientes').innerHTML = '<p>No hay solicitudes pendientes</p>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Procesar solicitud
window.procesarSolicitud = (solicitudId) => {
    document.getElementById('resultadoDui').value = '';
    document.getElementById('examenSeleccionado').value = solicitudId;
    alert('Ingrese el DUI del paciente para completar el resultado');
};

// Agregar resultado
document.getElementById('agregarResultadoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dui = document.getElementById('resultadoDui').value;
    const solicitudId = document.getElementById('examenSeleccionado').value;
    const resultado = document.getElementById('resultadoTexto').value;
    const archivo = document.getElementById('archivoResultado').files[0];
    
    if (!solicitudId) {
        alert('Seleccione un examen');
        return;
    }
    
    const formData = new FormData();
    formData.append('dui', dui);
    formData.append('solicitud_id', solicitudId);
    formData.append('resultado', resultado);
    if (archivo) formData.append('archivo', archivo);
    
    try {
        const response = await fetch(`${API_URL}/examenes/agregar-resultado`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            alert('Resultado agregado exitosamente');
            document.getElementById('agregarResultadoForm').reset();
            document.getElementById('infoPacienteResultados').innerHTML = '';
            cargarSolicitudesPendientes();
        } else {
            const data = await response.json();
            alert(data.error || 'Error al agregar resultado');
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Buscar paciente para historial
document.getElementById('buscarPacienteHistorial').addEventListener('click', async () => {
    const dui = document.getElementById('historialDui').value;
    if (!dui) {
        alert('Ingrese el DUI del paciente');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/pacientes/buscar/${dui}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('infoPacienteHistorial').innerHTML = `
                <div class="paciente-info">
                    <p><strong>${data.nombres} ${data.apellidos}</strong></p>
                    <p>DUI: ${data.dui} | Tel: ${data.telefono}</p>
                </div>
            `;
        } else {
            alert('Paciente no encontrado');
            document.getElementById('infoPacienteHistorial').innerHTML = '';
        }
    } catch (error) {
        alert('Error al buscar paciente');
    }
});

// Registrar historial clínico
document.getElementById('registrarHistorialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dui = document.getElementById('historialDui').value;
    const historialData = {
        dui,
        enfermedad: document.getElementById('enfermedad').value,
        fecha_inicio: document.getElementById('fechaInicio').value,
        intensidad: document.getElementById('intensidad').value,
        factores_alivio: document.getElementById('factoresAlivio').value,
        factores_empeoran: document.getElementById('factoresEmpeoran').value
    };
    
    try {
        const response = await fetch(`${API_URL}/pacientes/registrar-historial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(historialData)
        });
        
        if (response.ok) {
            alert('Historial clínico registrado');
            document.getElementById('registrarHistorialForm').reset();
            document.getElementById('infoPacienteHistorial').innerHTML = '';
        } else {
            const data = await response.json();
            alert(data.error || 'Error al registrar historial');
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

// Inicializar
cargarSolicitudesPendientes();
cargarHistorialSignos();