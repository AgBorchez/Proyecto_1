import { API_SOCIOS_URL, API_ENTRENADORES_URL, EstadoPagina, EstadoSocios } from "./config.js";
import { ValidacionDatos, ValidacionDatosEntrenadores } from "./validators.js"; 
import { cargarSocios, cargarSocios_TablaPatologias } from "./ui_manager.js"; 

//Para que el buscador responda de forma instantanea
export function configurarBuscador(inputId, funcionDeCarga) {
    const inputElement = document.getElementById(inputId);
    
    if (inputElement) {
        let timerBusqueda;
        
        inputElement.addEventListener('input', (event) => {
            clearTimeout(timerBusqueda);
            timerBusqueda = setTimeout(() => {
                funcionDeCarga(event.target.value);
            }, 300); 
        });
    }
}



export async function guardarSocio(event) {
    event.preventDefault();

    const dniInput = parseInt(document.getElementById('dni').value);
    const NameInput = document.getElementById('nombre');
    const LNameInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const patologiasIDs = [];
    document.querySelectorAll('input[name="patologia"]:checked').forEach(checkbox => {
        patologiasIDs.push(parseInt(checkbox.value));
    });

    if (!ValidacionDatos(dniInput, NameInput.value, LNameInput.value, emailInput.value, telefonoInput.value)) {
        return;
    }

    
    if(!EstadoSocios.fechaVencimiento){
        alert("Por favor, selecciona una membresía para determinar la fecha de vencimiento.");
        return false;
    }

    const socioObj = {
        dni: dniInput,
        name: NameInput.value.trim(),
        lastName: LNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: telefonoInput.value.trim(),
        joinDate: EstadoSocios.fechaAlta,
        endDate: EstadoSocios.fechaVencimiento,
        planId: EstadoSocios.PlanSeleccionado,
        patologias: patologiasIDs
        
    };

    const metodo = EstadoSocios.dniActual ? 'PUT' : 'POST';
    const urlFinal = EstadoSocios.dniActual ? `${API_SOCIOS_URL}/${EstadoSocios.dniActual}` : API_SOCIOS_URL;

    try {
        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socioObj)
        });

        if (respuesta.ok) {
            alert('socio guardado exitosamente.');
            if (EstadoPagina.EditionMode) {cancelarEdicion()};
            if(window.opener && !window.opener.closed){
                window.opener.cargarSocios();
            }
            window.close();
        } else {
            const errorText = await respuesta.text();
            alert('Error del servidor: ' + errorText);
        }
    } catch (error) {
        console.error('Error de conexión: ', error);
    }
}

export async function borrarSocio(dni) {
    if (confirm('¿Estás seguro de que querés borrar este socio para siempre?')) {
        try {
            const respuesta = await fetch(`${API_SOCIOS_URL}/${dni}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarSocios(); 
            } else {
                alert('No se pudo borrar el socio.');
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    }
}

export async function guardarEntrenador(event) {
    event.preventDefault();

    const dniInput = parseInt(document.getElementById('dni').value);
    const NameInput = document.getElementById('nombre');
    const LNameInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const especialidadInput = document.getElementById('especialidad');
    const turnoInput = document.getElementById('turno');
    const fechaIngresoInput = document.getElementById('fechaIngreso');
    const fechaRCPInput = document.getElementById('fechaRCP');

    if(!ValidacionDatosEntrenadores(especialidadInput.value, turnoInput.value, fechaIngresoInput.value, fechaRCPInput.value)) return;
    if(!ValidacionDatosEntrenadores(especialidadInput.value, turnoInput.value, fechaIngresoInput.value, fechaRCPInput.value)) return;


    const entrenadorObj = {
        dni: dniInput,
        name: NameInput.value.trim(),
        lastName: LNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: telefonoInput.value.trim(),
        specialty: especialidadInput.value,
        shift: turnoInput.value,
        joinDate: new Date(fechaIngresoInput.value).toISOString(),
        rcpExpirationDate: new Date(fechaRCPInput.value).toISOString(),
        isActive: true 
    };

    const metodo = EstadoSocios.dniActual ? 'PUT' : 'POST';
    const urlFinal = EstadoSocios.dniActual ? `${API_ENTRENADORES_URL}/${EstadoSocios.dniActual}` : API_ENTRENADORES_URL;

    try {
        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entrenadorObj)
        });

        if (respuesta.ok) {
            alert('¡Entrenador guardado exitosamente!');
            
            if(window.opener && !window.opener.closed){
                if (typeof window.opener.obtenerEntrenadores === 'function') {
                    window.opener.obtenerEntrenadores(); 
                }
            }
            window.close();
        } else {
            const errorText = await respuesta.text();
            alert('Error del servidor: ' + errorText);
        }
    } catch (error) {
        console.error('Error de conexión al guardar entrenador: ', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
}

export async function borrarEntrenador(dni) {
    if (confirm('¿Estás seguro de que querés borrar este entrenador para siempre?')) {
        try {
            const respuesta = await fetch(`${API_ENTRENADORES_URL}/${dni}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarSocios(); 
            } else {
                alert('No se pudo borrar el socio.');
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    }
}