# Laboratorio Clínico - Sistema de Gestión

Sistema integral para la gestión de pacientes, citas, exámenes y resultados de laboratorio clínico. Desarrollado con Node.js, Express, PostgreSQL y JavaScript puro.

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Uso del Sistema](#-uso-del-sistema)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## Características

### Administrador
- CRUD completo de pacientes
- Gestión de catálogo de exámenes
- Gestión de usuarios del sistema

### Doctor
- Registrar signos vitales (presión arterial, frecuencia cardíaca, temperatura, peso, altura, observaciones)
- Generar resultados de exámenes en PDF automáticamente
- Procesar solicitudes de exámenes pendientes
- Registrar historial clínico de pacientes
- Visualizar contactos de emergencia de los pacientes

### Paciente
- Ver información personal
- Agendar y cancelar citas médicas
- Solicitar exámenes del catálogo
- Descargar resultados de exámenes en PDF
- Ver historial clínico
- Gestionar contactos de emergencia
- Visualizar signos vitales

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | v18+ | Backend runtime |
| **Express** | v4.18 | Framework web |
| **PostgreSQL** | v15+ | Base de datos |
| **JWT** | v9.0 | Autenticación |
| **bcryptjs** | v2.4 | Encriptación de contraseñas |
| **PDFKit** | v0.14 | Generación de PDFs |
| **SweetAlert2** | v11 | Alertas profesionales |
| **FontAwesome** | v6.0 | Iconos |

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [PostgreSQL](https://www.postgresql.org/) (v15 o superior)
- [Git](https://git-scm.com/) (opcional, para clonar el repositorio)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ernestomartinezvas98/laboratorio-clinico.git
cd laboratorio-clinico

## Ejecutar ##
Incio: http://localhost:3000

### Credenciales de Prueba ###
Credenciales de Prueba
    Rol           Email	            Contraseña
👑 Administrador	admin@lab.com	    123456
👨‍⚕️ Doctor	        doctor@lab.com	  123456
👤 Paciente	      paciente@lab.com	123456
👤 Paciente      	maria@lab.com	    123456
👤 Paciente	      carlos@lab.com	  123456
👤 Paciente	      ana@lab.com	      123456
