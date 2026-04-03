// frontend
const API_URL = 'http://localhost:3000/api';

// Verificar autenticación
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token || (usuario.rol !== 'admin' && usuario.rol !== 'administrador')) {
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
    
    // Cargar datos según tab
    if (tabId === 'pacientes') cargarListaPacientes();
    if (tabId === 'examenes') cargarListaExamenes();
    if (tabId === 'usuarios') cargarListaUsuarios();
  });
});

// Registrar paciente
const registrarPacienteForm = document.getElementById('registrarPacienteForm');
if (registrarPacienteForm) {
    registrarPacienteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pacienteData = {
    dui: document.getElementById('pacienteDui').value,
    nombres: document.getElementById('pacienteNombres').value,
    apellidos: document.getElementById('pacienteApellidos').value,
    fecha_nacimiento: document.getElementById('pacienteFechaNacimiento').value,
    telefono: document.getElementById('pacienteTelefono').value,
    email: document.getElementById('pacienteEmail').value,
    password: document.getElementById('pacientePassword').value,
    rol: 'paciente'
  };
  
  try {
    const response = await fetch(`${API_URL}/admin/registrar-paciente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pacienteData)
    });
    /////////////////
    
    if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Paciente registrado exitosamente',
                confirmButtonColor: '#667eea'
            });
            document.getElementById('registrarPacienteForm').reset();
            cargarListaPacientes();
        } else {
            const data = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || 'Error al registrar paciente',
                confirmButtonColor: '#e53e3e'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            confirmButtonColor: '#e53e3e'
        });
    }
});
}
////////////////
// Cargar lista de pacientes
async function cargarListaPacientes(busqueda = '') {
  try {
    let url = `${API_URL}/admin/pacientes`;
    if (busqueda) {
      url += `?busqueda=${encodeURIComponent(busqueda)}`;
    }
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok) {
      const tbody = document.getElementById('tablaPacientes');
      if (data.length > 0) {
        tbody.innerHTML = data.map(paciente => `
          <tr>
            <td>${paciente.dui}</td>
            <td>${paciente.nombres}</td>
            <td>${paciente.apellidos}</td>
            <td>${paciente.email}</td>
            <td>${paciente.telefono}</td>
            <td>
              <<button onclick="editarPaciente(${paciente.id})" class="btn-editar">✏️ Editar</button>
              <button onclick="eliminarPaciente(${paciente.id})" class="btn-eliminar">🗑️ Eliminar</button>
          </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="6">No hay pacientes registrados</td></tr>';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
//////////////////

// Editar paciente
window.editarPaciente = async (id) => {
  console.log('Editar paciente llamado con ID:', id);
    console.log('Token actual:', token);
    try {
       console.log('Fetching:', `${API_URL}/admin/paciente/${id}`);
        // Obtener datos del paciente
        const response = await fetch(`${API_URL}/admin/paciente/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Response status:', response.status);
        const paciente = await response.json();
        console.log('Datos recibidos:', paciente);
        
        if (response.ok) {
            const { value: formValues } = await Swal.fire({
                title: 'Editar Paciente',
                html: `
                    <input id="swal-nombres" class="swal2-input" placeholder="Nombres" value="${paciente.nombres}">
                    <input id="swal-apellidos" class="swal2-input" placeholder="Apellidos" value="${paciente.apellidos}">
                    <input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${paciente.telefono}">
                    <input id="swal-email" class="swal2-input" placeholder="Email" value="${paciente.email}">
                `,
                focusConfirm: false,
                confirmButtonText: 'Guardar Cambios',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#e53e3e',
                preConfirm: () => {
                    return {
                        nombres: document.getElementById('swal-nombres').value,
                        apellidos: document.getElementById('swal-apellidos').value,
                        telefono: document.getElementById('swal-telefono').value,
                        email: document.getElementById('swal-email').value
                    };
                }
            });
            
            if (formValues) {
                const updateResponse = await fetch(`${API_URL}/admin/paciente/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formValues)
                });
                
                if (updateResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'Paciente actualizado exitosamente',
                        confirmButtonColor: '#667eea'
                    });
                    cargarListaPacientes();
                } else {
                    const errorData = await updateResponse.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorData.error || 'Error al actualizar',
                        confirmButtonColor: '#e53e3e'
                    });
                }
            }
        }
    } catch (error) {
      console.error('Error en editarPaciente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los datos del paciente'+ error.message,
            confirmButtonColor: '#e53e3e'
        });
    }
};

// Eliminar paciente
window.eliminarPaciente = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#667eea'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/admin/pacientes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El paciente ha sido eliminado',
                    confirmButtonColor: '#667eea'
                });
                cargarListaPacientes();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el paciente',
                    confirmButtonColor: '#e53e3e'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión',
                confirmButtonColor: '#e53e3e'
            });
        }
    }
};
/////////////////

// Buscar paciente
  const btnBuscar = document.getElementById('btnBuscarPaciente');
if (btnBuscar) {
    btnBuscar.addEventListener('click', () => {
  const busqueda = document.getElementById('buscarPaciente').value;
  cargarListaPacientes(busqueda);
});
}

// Registrar examen
const registrarExamenForm = document.getElementById('registrarExamenForm');
if (registrarExamenForm) {
    registrarExamenForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const examenData = {
    nombre: document.getElementById('examenNombre').value,
    precio: parseFloat(document.getElementById('examenPrecio').value),
    tiempo_entrega: document.getElementById('examenTiempo').value
  };
  
  try {
    const response = await fetch(`${API_URL}/admin/examenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(examenData)
    });
    

    //////////////
     if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Examen agregado exitosamente',
                confirmButtonColor: '#667eea'
            });

    //if (response.ok) {
      document.getElementById('registrarExamenForm').reset();
      cargarListaExamenes();
    } else {
      const data = await response.json();
      Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || 'Error al agregar examen',
                confirmButtonColor: '#e53e3e'
            });
      //alert(data.error || 'Error al agregar examen');
    }
  } catch (error) {
    Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
            confirmButtonColor: '#e53e3e'
        });
  }
});
}
////////////////

// Cargar lista de exámenes
async function cargarListaExamenes() {
  try {
    const response = await fetch(`${API_URL}/admin/examenes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok) {
      const tbody = document.getElementById('tablaExamenes');
      if (data.length > 0) {
        tbody.innerHTML = data.map(examen => `
          <tr>
            <td>${examen.id}</td>
            <td>${examen.nombre}</td>
            <td>$${examen.precio}</td>
            <td>${examen.tiempo_entrega}</td>
            <td>
              <button onclick="editarExamen(${examen.id})" class="btn-editar">✏️ Editar</button>
              <button onclick="eliminarExamen(${examen.id})" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="5">No hay exámenes registrados</td></tr>';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
/////////////////

// Editar examen
window.editarExamen = async (id) => {
    try {
        // Obtener datos del examen
        const response = await fetch(`${API_URL}/admin/examenes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const examen = await response.json();
        
        if (response.ok) {
            const { value: formValues } = await Swal.fire({
                title: 'Editar Examen',
                html: `
                    <input id="swal-nombre" class="swal2-input" placeholder="Nombre del examen" value="${examen.nombre}">
                    <input id="swal-precio" class="swal2-input" placeholder="Precio" value="${examen.precio}">
                    <input id="swal-tiempo" class="swal2-input" placeholder="Tiempo de entrega" value="${examen.tiempo_entrega}">
                `,
                focusConfirm: false,
                confirmButtonText: 'Guardar Cambios',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#e53e3e',
                preConfirm: () => {
                    return {
                        nombre: document.getElementById('swal-nombre').value,
                        precio: parseFloat(document.getElementById('swal-precio').value),
                        tiempo_entrega: document.getElementById('swal-tiempo').value
                    };
                }
            });
            
            if (formValues) {
                const updateResponse = await fetch(`${API_URL}/admin/examenes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formValues)
                });
                
                if (updateResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'Examen actualizado exitosamente',
                        confirmButtonColor: '#667eea'
                    });
                    cargarListaExamenes();
                } else {
                    const errorData = await updateResponse.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorData.error || 'Error al actualizar',
                        confirmButtonColor: '#e53e3e'
                    });
                }
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los datos del examen',
            confirmButtonColor: '#e53e3e'
        });
    }
};

// Eliminar examen
window.eliminarExamen = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#667eea'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/admin/examenes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El examen ha sido eliminado',
                    confirmButtonColor: '#667eea'
                });
                cargarListaExamenes();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el examen',
                    confirmButtonColor: '#e53e3e'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión',
                confirmButtonColor: '#e53e3e'
            });
        }
    }
};


// Cargar lista de usuarios
async function cargarListaUsuarios() {
  try {
    const response = await fetch(`${API_URL}/admin/usuarios`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (response.ok) {
      const tbody = document.getElementById('tablaUsuarios');
      if (data.length > 0) {
        tbody.innerHTML = data.map(usuario => `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombres} ${usuario.apellidos}</td>
            <td>${usuario.email}</td>
            <td>
            <span class="rol-badge ${usuario.rol}">${usuario.rol === 'admin' ? '👑 Administrador' : usuario.rol === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Paciente'}</span></td><td>
            <button onclick="editarUsuario(${usuario.id})" class="btn-editar">✏️ Editar</button>
            <button onclick="eliminarUsuario(${usuario.id})" class="btn-eliminar">🗑️ Eliminar</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="5">No hay usuarios registrados</td></tr>';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/////////////////
// Editar usuario
window.editarUsuario = async (id) => {
  console.log('=== EDITAR USUARIO ===');
    console.log('ID recibido:', id);
    console.log('Token:', token);

    try {
        // Obtener datos del usuario
        const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Response status:', response.status);

        const usuarioData = await response.json();
        console.log('Datos recibidos:', usuarioData);
        
        if (response.ok) {
            const { value: formValues } = await Swal.fire({
                title: 'Editar Usuario',
                html: `
                    <input id="swal-nombres" class="swal2-input" placeholder="Nombres" value="${usuarioData.nombres}">
                    <input id="swal-apellidos" class="swal2-input" placeholder="Apellidos" value="${usuarioData.apellidos}">
                    <input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${usuarioData.telefono}">
                    <input id="swal-email" class="swal2-input" placeholder="Email" value="${usuarioData.email}">
                    <select id="swal-rol" class="swal2-select">
                        <option value="paciente" ${usuarioData.rol === 'paciente' ? 'selected' : ''}>👤 Paciente</option>
                        <option value="doctor" ${usuarioData.rol === 'doctor' ? 'selected' : ''}>👨‍⚕️ Doctor</option>
                        <option value="admin" ${usuarioData.rol === 'admin' ? 'selected' : ''}>👑 Administrador</option>
                    </select>
                `,
                focusConfirm: false,
                confirmButtonText: 'Guardar Cambios',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#e53e3e',
                preConfirm: () => {
                    return {
                        nombres: document.getElementById('swal-nombres').value,
                        apellidos: document.getElementById('swal-apellidos').value,
                        telefono: document.getElementById('swal-telefono').value,
                        email: document.getElementById('swal-email').value,
                        rol: document.getElementById('swal-rol').value
                    };
                }
            });
            
            if (formValues) {
                const updateResponse = await fetch(`${API_URL}/admin/usuarios/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formValues)
                });
                
                if (updateResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'Usuario actualizado exitosamente',
                        confirmButtonColor: '#667eea'
                    });
                    cargarListaUsuarios();
                } else {
                    const errorData = await updateResponse.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorData.error || 'Error al actualizar',
                        confirmButtonColor: '#e53e3e'
                    });
                }
            }
        }
    } catch (error) {
      console.error('Error en fetch:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los datos del usuario: ' + error.message,
            confirmButtonColor: '#e53e3e'
        });
    }
};

// Eliminar usuario
window.eliminarUsuario = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#667eea'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado',
                    confirmButtonColor: '#667eea'
                });
                cargarListaUsuarios();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el usuario',
                    confirmButtonColor: '#e53e3e'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión',
                confirmButtonColor: '#e53e3e'
            });
        }
    }
};

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

// Inicializar
cargarListaPacientes();