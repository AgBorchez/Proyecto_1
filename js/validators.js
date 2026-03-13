import { EstadoSocios, EstadoPagina } from "./config.js";

export function ValidacionDatos(Dni, Name, LName, Email, Telefono) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(isNaN(Dni) || Dni <= 0){
        alert("El campo DNI no puede estar vacío ni contener letras ni ser menor o igual a cero.");
        return false;
    }

    if(!Name.trim() || !LName.trim()){
        alert("El socio debe tener un nombre y apellido válidos.");
        return false;
    }

    if(!Email.trim() || !emailRegex.test(Email)){
        alert("Por favor, ingresa un email válido.");
        return false;
    }

    if(Telefono.trim().length < 8 || isNaN(parseInt(Telefono.trim()))){
        alert("Por favor, ingresa un número de teléfono válido.");
        return false;
    }

        return true;
}

export function SelectorPlanes(meses, idboton) {
    
        document.querySelectorAll('.btn-Plan').forEach(btn => {
        btn.style.backgroundColor = 'var(--plan-Btn)';
    });
    document.getElementById(idboton).style.backgroundColor = 'var(--save-Btn)';
    
    const fechaActual = new Date(); fechaActual.setHours(0, 0, 0, 0);
    
    if(!EstadoPagina.EditionMode){
        const fechabaja = new Date(fechaActual);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        EstadoSocios.fechaAlta = fechaActual.toISOString().split('T')[0];
        EstadoSocios.fechaVencimiento = fechabaja.toISOString().split('T')[0];
        EstadoSocios.PlanSeleccionado = meses;
    }else{
        const fechabaja = new Date(EstadoSocios.fechaAlta);
        fechabaja.setMonth(fechabaja.getMonth() + meses);
        EstadoSocios.fechaVencimiento = fechabaja.toISOString().split('T')[0];
        EstadoSocios.PlanSeleccionado = meses;
    }
    document.getElementById("infoFechaVencimiento").innerText = `Vence en: ${EstadoSocios.fechaVencimiento}`;
}

export function ValidacionDatosEntrenadores(especialidad, turno, fechaIngreso, fechaRCP){
    if(!especialidad) { alert("Ingerese una especialidad"); return false }
    if(!turno) { alert("Ingrese un turno"); return false }
    if(!fechaIngreso) { alert ("Ingrese una fecha de ingreso"); return false }
    if(!fechaRCP) { alert ("Ingrese una fecha de vencimiento para la certificacion de RCP"); return false }

    return true;
}