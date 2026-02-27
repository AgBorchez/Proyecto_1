 // ATENCIÓN: Revisá que sea el puerto de tu API
        const API_URL = 'https://localhost:7102/api/socios';

        // 1. LEER (GET)
        async function cargarSocios() {
            try {
                const respuesta = await fetch(API_URL); 
                const socios = await respuesta.json();
                
                const tabla = document.getElementById('tablaSocios');
                tabla.innerHTML = ''; 

                socios.forEach(socio => {
                    const fila = `
                        <tr>
                            <td>${socio.id}</td>
                            <td>${socio.name}</td>
                            <td>${socio.lastName}</td>
                            <td>${socio.email}</td>
                            <td>${socio.isActive ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <button class="btn-editar" onclick="prepararEdicion(${socio.id}, '${socio.name}', '${socio.lastName}', '${socio.email}', ${socio.isActive})">Editar</button>
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

        // 2. CREAR o ACTUALIZAR (POST / PUT)
        async function guardarSocio(event) {
            event.preventDefault();

            // Leemos si hay un ID en el campo oculto
            const idOculto = document.getElementById('socioId').value;
            
            const socioObj = {
                id: idOculto ? parseInt(idOculto) : 0, // Si editamos, mandamos el ID real. Si creamos, mandamos 0.
                name: document.getElementById('nombre').value,
                lastName: document.getElementById('apellido').value,
                email: document.getElementById('email').value,
                isActive: document.getElementById('activo').checked
            };

            // La magia de la decisión: ¿Es un POST o un PUT?
            const metodo = idOculto ? 'PUT' : 'POST';
            const urlFinal = idOculto ? `${API_URL}/${idOculto}` : API_URL;

            try {
                const respuesta = await fetch(urlFinal, {
                    method: metodo,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(socioObj)
                });

                if (respuesta.ok) {
                    cancelarEdicion(); // Limpiamos todo
                    cargarSocios();    // Recargamos la tabla
                } else {
                    alert('Error al guardar el socio en la base de datos.');
                }
            } catch (error) {
                console.error("Error al guardar:", error);
            }
        }

        // 3. ELIMINAR (DELETE)
        async function borrarSocio(id) {
            // Un pequeño cartel para no borrar por accidente
            if(confirm("¿Estás seguro de que querés borrar este socio para siempre?")) {
                try {
                    const respuesta = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE'
                    });

                    if (respuesta.ok) {
                        cargarSocios(); // Refrescamos la tabla si se borró con éxito
                    } else {
                        alert('No se pudo borrar el socio.');
                    }
                } catch (error) {
                    console.error("Error al borrar:", error);
                }
            }
        }

        // 4. PREPARAR INTERFAZ PARA EDITAR
        function prepararEdicion(id, nombre, apellido, email, activo) {
            // Subimos los datos al formulario
            document.getElementById('socioId').value = id;
            document.getElementById('nombre').value = nombre;
            document.getElementById('apellido').value = apellido;
            document.getElementById('email').value = email;
            document.getElementById('activo').checked = activo;

            // Cambiamos los títulos y botones para que quede lindo
            document.getElementById('tituloFormulario').innerText = "Editando Socio #" + id;
            document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
            document.getElementById('btnSubmit').className = "btn-editar";
            document.getElementById('btnCancelar').style.display = "inline-block"; // Mostramos el botón de cancelar
        }

        // 5. RESTAURAR INTERFAZ A MODO "CREAR"
        function cancelarEdicion() {
            document.getElementById('formSocio').reset();
            document.getElementById('socioId').value = "";
            document.getElementById('tituloFormulario').innerText = "Alta de Nuevo Socio";
            document.getElementById('btnSubmit').innerText = "Guardar Socio";
            document.getElementById('btnSubmit').className = "btn-guardar";
            document.getElementById('btnCancelar').style.display = "none";
        }

        // Arrancamos la web
        cargarSocios();