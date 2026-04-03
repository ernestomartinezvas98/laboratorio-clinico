
const API_URL = 'http://localhost:3000/api';

// Verificar autenticación
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token || usuario.rol !== 'paciente') {
  window.location.href = 'login.html';
}

// Cargar datos del paciente
async function cargarDatosPaciente() {
  try {
    const response = await fetch(`${API_URL}/pacientes/mi-perfil`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('infoPersonal').innerHTML = `
        <p><strong>Nombre:</strong> ${data.nombres} ${data.apellidos}</p>
        <p><strong>DUI:</strong> ${data.dui}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Correo:</strong> ${data.email}</p>
        <p><strong>Fecha Nacimiento:</strong> ${new Date(data.fecha_nacimiento).toLocaleDateString()}</p>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cargar signos vitales
async function cargarSignosVitales() {
  try {
    const response = await fetch(`${API_URL}/signos-vitales/mis-signos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok && data.length > 0) {
      const ultimo = data[0];
      document.getElementById('signosVitales').innerHTML = `
        <p><strong>Presión Arterial:</strong> ${ultimo.presion_arterial || 'No registrado'}</p>
        <p><strong>Frecuencia Cardíaca:</strong> ${ultimo.frecuencia_cardiaca || 'No registrado'} lpm</p>
        <p><strong>Temperatura:</strong> ${ultimo.temperatura || 'No registrado'} °C</p>
        <p><strong>Peso:</strong> ${ultimo.peso || 'No registrado'} kg</p>
        <p><strong>Altura:</strong> ${ultimo.altura || 'No registrado'} cm</p>
        <p><strong>Observaciones:</strong> ${ultimo.observaciones || 'No hay observaciones'}</p>
        <p><strong>Fecha:</strong> ${new Date(ultimo.fecha_registro).toLocaleString()}</p>
      `;
    } else {
      document.getElementById('signosVitales').innerHTML = '<p>No hay registros de signos vitales</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Agendar cita
document.getElementById('agendarCitaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fecha = document.getElementById('fechaCita').value;
  const hora = document.getElementById('horaCita').value;
  const motivo = document.getElementById('motivoCita').value;
  
  try {
    const response = await fetch(`${API_URL}/citas/agendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ fecha, hora, motivo })
    });
    
    if (response.ok) {
      alert('Cita agendada exitosamente');
      document.getElementById('agendarCitaForm').reset();
      cargarMisCitas();
    } else {
      const data = await response.json();
      alert(data.error || 'Error al agendar cita');
    }
  } catch (error) {
    alert('Error de conexión');
  }
});

// Cargar mis citas
async function cargarMisCitas() {
  try {
    const response = await fetch(`${API_URL}/citas/mis-citas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok && data.length > 0) {
      document.getElementById('misCitas').innerHTML = `
        <table>
          <thead>
            <tr><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            ${data.map(cita => `
              <tr>
                <td>${new Date(cita.fecha).toLocaleDateString()}</td>
                <td>${cita.hora}</td>
                <td>${cita.motivo}</td>
                <td>${cita.estado}</td>
                <td><button onclick="eliminarCita(${cita.id})" class="btn-eliminar">Eliminar</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      document.getElementById('misCitas').innerHTML = '<p>No tienes citas agendadas</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Eliminar cita
window.eliminarCita = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta cita?')) {
    try {
      const response = await fetch(`${API_URL}/citas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Cita eliminada exitosamente');
        cargarMisCitas();
      }
    } catch (error) {
      alert('Error al eliminar cita');
    }
  }
};

// Cargar catálogo de exámenes
async function cargarCatalogoExamenes() {
  try {
    const response = await fetch(`${API_URL}/examenes/catalogo`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('catalogoExamenes').innerHTML = `
        <table>
          <thead>
            <tr><th>Examen</th><th>Precio</th><th>Tiempo Entrega</th><th>Solicitar</th></tr>
          </thead>
          <tbody>
            ${data.map(examen => `
              <tr>
                <td>${examen.nombre}</td>
                <td>$${examen.precio}</td>
                <td>${examen.tiempo_entrega}</td>
                <td><button onclick="solicitarExamen(${examen.id})" class="btn-primary">Solicitar</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Solicitar examen
window.solicitarExamen = async (examenId) => {
  try {
    const response = await fetch(`${API_URL}/examenes/solicitar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ examen_id: examenId })
    });
    
    if (response.ok) {
      alert('Examen solicitado exitosamente');
      cargarMisResultados();
    } else {
      const data = await response.json();
      alert(data.error || 'Error al solicitar examen');
    }
  } catch (error) {
    alert('Error de conexión');
  }
};

// Cargar mis resultados
async function cargarMisResultados() {
  try {
    const response = await fetch(`${API_URL}/examenes/mis-resultados`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok && data.length > 0) {
      document.getElementById('misResultados').innerHTML = `
        <table>
          <thead>
            <tr><th>Examen</th><th>Fecha Solicitud</th><th>Estado</th><th>Resultado</th><th>PDF</th></tr>
          </thead>
          <tbody>
            ${data.map(resultado => `
              <tr>
                <td>${resultado.examen_nombre}</td>
                <td>${new Date(resultado.fecha_solicitud).toLocaleDateString()}</td>
                <td>${resultado.estado}</td>
                <td>${resultado.resultado || 'Pendiente'}</td>
                <td>${resultado.archivo_pdf ? `<a href="${API_URL}/uploads/${resultado.archivo_pdf}" target="_blank">Descargar PDF</a>` : 'No disponible'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      document.getElementById('misResultados').innerHTML = '<p>No tienes resultados de exámenes</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cargar historial clínico
async function cargarHistorialClinico() {
  try {
    const response = await fetch(`${API_URL}/pacientes/mi-historial`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok && data.length > 0) {
      document.getElementById('historialClinico').innerHTML = `
        <table>
          <thead>
            <tr><th>Fecha</th><th>Enfermedad</th><th>Intensidad</th><th>Factores Alivio</th><th>Factores Empeoran</th></tr>
          </thead>
          <tbody>
            ${data.map(historial => `
              <tr>
                <td>${new Date(historial.created_at).toLocaleDateString()}</td>
                <td>${historial.enfermedad}</td>
                <td>${historial.intensidad}</td>
                <td>${historial.factores_alivio || '-'}</td>
                <td>${historial.factores_empeoran || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      document.getElementById('historialClinico').innerHTML = '<p>No hay historial clínico registrado</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cargar contacto de emergencia
async function cargarContactoEmergencia() {
  try {
    const response = await fetch(`${API_URL}/pacientes/mi-contacto-emergencia`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok && data) {
      document.getElementById('contactoEmergencia').innerHTML = `
        <p><strong>Nombre:</strong> ${data.nombre || 'No registrado'}</p>
        <p><strong>Teléfono:</strong> ${data.telefono || 'No registrado'}</p>
        <p><strong>Relación:</strong> ${data.relacion || 'No registrada'}</p>
      `;
    } else {
      document.getElementById('contactoEmergencia').innerHTML = '<p>No hay contacto de emergencia registrado</p>';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

// Inicializar
cargarDatosPaciente();
cargarSignosVitales();
cargarMisCitas();
cargarCatalogoExamenes();
cargarMisResultados();
cargarHistorialClinico();
cargarContactoEmergencia();