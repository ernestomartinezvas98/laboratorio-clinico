
//Widget para mostrar datos de Human API
async function cargarDatosExternos() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const container = document.getElementById('widget-salud-externa-contenido');
    if (!container) return;

    try {
        container.innerHTML = '<p>Cargando datos de salud...</p>';
        
        const response = await fetch('/api/health-external/datos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.data) {
            const { perfil, heartRate, bloodPressure } = data.data;
            
            // Últimos registros
            const ultimoHeartRate = heartRate[heartRate.length - 1];
            const ultimoBloodPressure = bloodPressure[bloodPressure.length - 1];
            
            container.innerHTML = `
                <div class="datos-salud-externa">
                    <div class="salud-header">
                        <h4>Datos desde Human API</h4>
                        <span class="badge">Demo</span>
                    </div>
                    
                    <div class="salud-perfil">
                        <p><strong>Perfil:</strong> ${perfil.nombre}, ${perfil.edad} años</p>
                        <p><strong>Peso:</strong> ${perfil.peso} kg | <strong>Altura:</strong> ${perfil.altura} cm</p>
                    </div>
                    
                    <div class="salud-vitales">
                        <div class="vital-card">
                            <span class="vital-icon"></span>
                            <span class="vital-value">${ultimoHeartRate?.value || '--'}</span>
                            <span class="vital-label">Frecuencia Cardíaca</span>
                            <span class="vital-time">${ultimoHeartRate?.time ? new Date(ultimoHeartRate.time).toLocaleTimeString() : ''}</span>
                        </div>
                        
                        <div class="vital-card">
                            <span class="vital-icon"></span>
                            <span class="vital-value">${ultimoBloodPressure?.systolic || '--'}/${ultimoBloodPressure?.diastolic || '--'}</span>
                            <span class="vital-label">Presión Arterial</span>
                            <span class="vital-time">${ultimoBloodPressure?.time ? new Date(ultimoBloodPressure.time).toLocaleTimeString() : ''}</span>
                        </div>
                    </div>
                    
                    <div class="salud-footer">
                        <small>Datos de demostración. Conecta tu cuenta real para datos personales.</small>
                        <button onclick="conectarHumanAPI()" class="btn-secondary">🔌 Conectar con Human API</button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Error al cargar datos externos</p>';
    }
}

// FunciOn para conectar con Human API
window.conectarHumanAPI = () => {
    // Esto redirigirá a Human API para autenticación
    // Por ahora mostramos un mensaje
    alert('Funcionalidad en desarrollo. Para conectar con tu cuenta real, implementaremos el flujo OAuth.\n\nPor ahora estás viendo datos de demostración.');
};

// Cargar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDatosExternos);