import { ValidacionDatos, ValidacionDatosEntrenadores } from "./validators.js";
import { EstadoSocios } from "./config.js";

export function EstadoFormularioSocios(estado){

    if(estado === 2){
        const dniInput = parseInt(document.getElementById('dni').value);
        const NameInput = document.getElementById('nombre');
        const LNameInput = document.getElementById('apellido');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');

        if(!ValidacionDatos(dniInput, NameInput.value, LNameInput.value, emailInput.value, telefonoInput.value)) return;

        if(!EstadoSocios.fechaVencimiento){
        alert("Por favor, selecciona una membresía para determinar la fecha de vencimiento.");
        return false;
    }
}

    const DivsPaso2 = document.querySelectorAll('.AltaSocio_1');
    const DivsPaso1 = document.querySelectorAll('.AltaSocio_2');

    switch(estado){
        case 1:
            DivsPaso1.forEach(D => {
                D.style.display = 'none';
                console.log("Paso 1 oculto.");
            });

            DivsPaso2.forEach(D => {
                D.style.display = '';
                console.log("Paso 2 oculto.");
            });
            
            break;
        case 2:
            
            DivsPaso2.forEach(D => {
                D.style.display = 'none';
                console.log("Paso 2 oculto.");
            });

            DivsPaso1.forEach(D => {
                D.style.display = '';
                console.log("Paso 1 oculto.");
            });
            break;
    }
}

export function EstadoFormularioEntrenadores(estado) {
    if (estado === 2) {
        const dniInput = parseInt(document.getElementById('dni').value);
        const NameInput = document.getElementById('nombre');
        const LNameInput = document.getElementById('apellido');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const especialidadInput = document.getElementById('especialidad');
        const turnoInput = document.getElementById('turno');
        const fechaIngresoInput = document.getElementById('fechaIngreso');
        const fechaRCPInput = document.getElementById('fechaRCP');

        if (!ValidacionDatos(dniInput, NameInput.value, LNameInput.value, emailInput.value, telefonoInput.value)) {
            return; 
        }
    }

    const DivsPaso1 = document.querySelectorAll('.AltaEntrenador_1');
    const DivsPaso2 = document.querySelectorAll('.AltaEntrenador_2');

    switch (estado) {
        case 1:
            DivsPaso1.forEach(div => {
                div.style.display = 'flex'; 
            });
            DivsPaso2.forEach(div => {
                div.style.display = 'none';
            });
            break;

        case 2:
            DivsPaso1.forEach(div => {
                div.style.display = 'none';
            });
            DivsPaso2.forEach(div => {
                div.style.display = 'flex';
            });
            break;
    }
}