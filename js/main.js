import { inicializarTema, EstadoPagina, EstadoSocios, API_SOCIOS_URL, API_ENTRENADORES_URL } from "./config.js"; 

import { cargarSocios, FiltroEstado , prepararEdicionSocios, prepararEdicionEntrenador, abrirFormulario, ordenarPor, cargarSocios_TablaPatologias, cargarEntrenadores} from "./ui_manager.js";

import { SelectorPlanes } from "./validators.js";

import { guardarSocio, borrarSocio, guardarEntrenador, configurarBuscador, borrarEntrenador } from "./api_service.js";

import { EstadoFormularioSocios, EstadoFormularioEntrenadores } from "./EstadoFormulariosAlta.js";

document.addEventListener('DOMContentLoaded', async () => {

    
    inicializarTema();

    const tablaSocios = document.getElementById('tablaSocios');
    if (tablaSocios) {
        
        window.ordenarPor = ordenarPor;
        window.borrarSocio = borrarSocio;
        window.abrirFormulario = abrirFormulario;
        window.FiltroEstado = FiltroEstado;
        window.cargarSocios = cargarSocios;
        window.prepararEdicionSocios = prepararEdicionSocios;

        // Carga inicial
        if (window.location.pathname.endsWith('Pagina_Inicio.html') || window.location.pathname.includes('Inicio')) { 
            FiltroEstado(true, 'filtro-Activo');
            cargarSocios();
        } 
    
        if (window.location.pathname.endsWith('Index_Patologias.html') || window.location.pathname.includes('Patologias')) { cargarSocios_TablaPatologias(); }
        
    }

    const tablaEntrenadores = document.getElementById('tablaEntrenadores')

    if(tablaEntrenadores){
        window.ordenarPor = ordenarPor;
        window.borrarEntrenador = borrarEntrenador;
        window.cargarEntrenadores = cargarEntrenadores;
        window.guardarEntrenador = guardarEntrenador;
        window.prepararEdicionEntrenador = prepararEdicionEntrenador;

        cargarEntrenadores();
    }

    
    const formSocios = document.getElementById('formSocio');
    if (formSocios) {
        formSocios.addEventListener('submit', guardarSocio);

        window.SelectorPlanes = SelectorPlanes;
        window.EstadoFormularioSocios = EstadoFormularioSocios;
        

        //Para cargar el socio cuando se inicia un formulario en modo edicion

        const parametros = new URLSearchParams(window.location.search);
        const DniEditar = parametros.get('editarDni')
        

        if(DniEditar){
            const respuesta = await fetch(`${API_SOCIOS_URL}/${DniEditar}`);

            if(!respuesta.ok) {
                alert("Algo salio mal...")
                return
            }
            const socio = await respuesta.json();
            let checkboxes = document.querySelectorAll('.CheckboxPatologias_CrearSocio')

            document.getElementById('dni').value = socio.dni;
            document.getElementById('dni').readOnly = true;
            document.getElementById('nombre').value = socio.name;
            document.getElementById('apellido').value = socio.lastName;
            document.getElementById('email').value = socio.email;
            document.getElementById('telefono').value = socio.phone;
            EstadoSocios.fechaAlta = EstadoPagina.FiltroEstadoSocios ? new Date(socio.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
            document.getElementById('btnSubmit').className = "btn-editar";
            checkboxes.forEach(checkb => {
                if(socio.patologias.includes(Number(checkb.id))){
                    checkb.checked = true;
                }
            }); 
        }
    }

    const formEntrenadores = document.getElementById('formEntrenador');

    if(formEntrenadores){
        formEntrenadores.addEventListener('submit', guardarEntrenador)

        window.EstadoFormularioEntrenadores = EstadoFormularioEntrenadores;

        const parametros = new URLSearchParams(window.location.search);
        const DniEditar = parametros.get('editarDni')
        

        if(DniEditar){
            const respuesta = await fetch(`${API_ENTRENADORES_URL}/${DniEditar}`);

            if(!respuesta.ok) {
                alert("Algo salio mal...")
                return
            }
            const entrenador = await respuesta.json();
            let checkboxes = document.querySelectorAll('.CheckboxPatologias_CrearSocio')

            document.getElementById('dni').value = entrenador.dni;
            document.getElementById('dni').readOnly = true;
            document.getElementById('nombre').value = entrenador.name;
            document.getElementById('apellido').value = entrenador.lastName;
            document.getElementById('email').value = entrenador.email;
            document.getElementById('telefono').value = entrenador.phone;
            document.getElementById('fechaIngreso').value = entrenador.joinDate.split('T')[0];
            document.getElementById('fechaRCP').value = entrenador.rcpExpirationDate.split('T')[0];
            document.getElementById('especialidad').value = entrenador.specialty;
            document.getElementById('turno').value = entrenador.shift;
            document.getElementById('btnSubmitEntrenador').innerText = "Actualizar Cambios";
            document.getElementById('btnSubmitEntrenador').className = "btn-editar";
        }
    }

    configurarBuscador('inputBusqueda_Socios', cargarSocios);
    configurarBuscador('inputBusqueda_tablaPatologias', cargarSocios_TablaPatologias);
    configurarBuscador('inputBusquedaEntrenadores', cargarEntrenadores);
});