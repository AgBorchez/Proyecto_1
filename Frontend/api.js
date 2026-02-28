const API_URL = 'https://localhost:7102/api/socios';


async function cargarSocios(textoBusqueda = '') {
    try {
        let urlfinal = API_URL;
        if (textoBusqueda !== ''){
            urlfinal = `${API_URL}?buscar=${textoBusqueda}`;
        }

        const respuesta = await fetch(urlfinal);
        const socios = await respuesta.json();

        const tabla = document.getElementById('tablaSocios');
        tabla.innerHTML = '';

        if(socios.length === 0){
        tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">No se encontraron socios.</td></tr>';
        return;
        }

        socios.forEach(socio => {
            const fila = `
                        <tr>
                            <td>${socio.id}</td>
                            <td>${socio.name}</td>
                            <td>${socio.lastName}</td>
                            <td>${socio.email}</td>
                            <td>${new Date(socio.joinedDate).toLocaleDateString('es-AR', {timeZone: 'UTC'})}</td>
                            <td>${socio.isActive ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <button class="btn-editar" onclick="prepararEdicion(${socio.id}, '${socio.name}', '${socio.lastName}', 
                                '${socio.email}', '${socio.joinedDate.split('T')[0]}', ${socio.isActive})">Editar</button>
                                <button class="btn-eliminar" onclick="borrarSocio(${socio.id})">Borrar</button>
                            </td>
                        </tr>
                    `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}


async function guardarSocio(event) {
    event.preventDefault();


    const idOculto = document.getElementById('socioId').value;


    console.log("Enviando al backend:", document.getElementById('fechaIngreso').value);

    const socioObj = {
        id: idOculto ? parseInt(idOculto) : 0,
        name: document.getElementById('nombre').value,
        lastName: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        JoinedDate: document.getElementById('fechaIngreso').value,
        isActive: document.getElementById('activo').checked
        
    };


    const metodo = idOculto ? 'PUT' : 'POST';
    const urlFinal = idOculto ? `${API_URL}/${idOculto}` : API_URL;

    try {
        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(socioObj)
        });

        if (respuesta.ok) {
            cancelarEdicion();
            cargarSocios();
        } else {
            alert('Error al guardar el socio en la base de datos.');
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
}

async function borrarSocio(id) {

    if (confirm("¿Estás seguro de que querés borrar este socio para siempre?")) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
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


function prepararEdicion(id, nombre, apellido, email, joinedDate, activo) {

    document.getElementById('socioId').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('apellido').value = apellido;
    document.getElementById('email').value = email;
    document.getElementById('fechaIngreso').value = joinedDate;
    document.getElementById('activo').checked = activo;


    document.getElementById('tituloFormulario').innerText = "Editando Socio #" + id;
    document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
    document.getElementById('btnSubmit').className = "btn-editar";
    document.getElementById('btnCancelar').style.display = "inline-block"; 
}


function cancelarEdicion() {
    document.getElementById('formSocio').reset();
    document.getElementById('socioId').value = "";
    document.getElementById('tituloFormulario').innerText = "Alta de Nuevo Socio";
    document.getElementById('btnSubmit').innerText = "Guardar Socio";
    document.getElementById('btnSubmit').className = "btn-guardar";
    document.getElementById('btnCancelar').style.display = "none";
}

function buscarSocios() {
    const textoBusqueda = document.getElementById('inputBusqueda').value;
    cargarSocios(textoBusqueda);
}

function limpiarBusqueda() {
    document.getElementById('inputBusqueda').value = '';
    cargarSocios();
}


cargarSocios();