let map;
let marcadoresActuales = [];

async function cargarPaises() {
    try {
        const selectNacionalidad = document.getElementById('nacionalidad');
        const selectRegistro = document.getElementById('pais');
        const selectPerfil = document.getElementById('editPais');

        if (!selectNacionalidad && !selectRegistro && !selectPerfil) return;

        const respuesta = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations');
        let paises = await respuesta.json();

        paises.sort((a, b) => a.translations.spa.common.localeCompare(b.translations.spa.common));

        const llenarSelect = (selectElement, textoPorDefecto) => {
            if (!selectElement) return;
            selectElement.innerHTML = `<option value="" selected disabled>${textoPorDefecto}</option>`;
            paises.forEach(pais => {
                const opcion = document.createElement('option');
                opcion.value = pais.cca2;
                opcion.textContent = pais.translations.spa.common;
                selectElement.appendChild(opcion);
            });
        };

        llenarSelect(selectNacionalidad, '¿De qué país quieres comer? (•⤙•)');
        llenarSelect(selectRegistro, 'Selecciona tu país...');
        llenarSelect(selectPerfil, 'Selecciona tu país...');

    } catch (error) {
        console.error('Error al cargar la lista de países:', error);
    }
}

async function cargarCategorias() {
    const contenedor = document.getElementById('contenedor-categorias');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('http://localhost:3000/api/categorias');
        const categorias = await respuesta.json();

        contenedor.innerHTML = '';

        categorias.forEach(cat => {
            contenedor.innerHTML += `
                <div class="form-check mb-1">
                    <input class="form-check-input filtro-categoria" type="checkbox" value="${cat.id}" id="cat-${cat.id}">
                    <label class="form-check-label text-secondary small" for="cat-${cat.id}">${cat.nombre}</label>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        contenedor.innerHTML = '<span class="text-danger small">Error al cargar</span>';
    }
}

async function agregarNuevaCategoria() {
    const input = document.getElementById('nuevaCategoriaInput');
    const mensaje = document.getElementById('msgCategoria');
    const nombre = input.value.trim();

    if (!nombre) return;

    mensaje.innerText = "Guardando...";
    mensaje.className = "small mt-1 text-primary";

    try {
        const respuesta = await fetch('http://localhost:3000/api/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            input.value = '';
            mensaje.innerText = "¡Añadida!";
            mensaje.className = "small mt-1 text-success";
            cargarCategorias();
            setTimeout(() => mensaje.innerText = '', 2000);
        } else {
            mensaje.innerText = data.error;
            mensaje.className = "small mt-1 text-danger";
        }
    } catch (error) {
        mensaje.innerText = "Error de conexión";
        mensaje.className = "small mt-1 text-danger";
    }
}


document.addEventListener('DOMContentLoaded', async () => {

    await cargarPaises();
    await cargarCategorias();

    const token = localStorage.getItem('hogaranza_token');
    const mensajePerfil = document.getElementById('mensajePerfil');

    if (window.location.pathname.includes('perfil.html') && !token) {
        window.location.href = 'login.html';
        return;
    }

    if (token) {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const usuario = await response.json();
                const bandera = document.getElementById('displayBandera');
                const listaRestaurantes = document.getElementById('lista-restaurantes-favoritos');

                if (listaRestaurantes) {
                    listaRestaurantes.innerHTML = ''; 

                    if (usuario.restaurantesFavoritos && usuario.restaurantesFavoritos.length > 0) {
                        usuario.restaurantesFavoritos.forEach((restaurante, index) => {
                            listaRestaurantes.innerHTML += `
                    <li class="list-group-item bg-amarillo d-flex justify-content-between align-items-center item-lista">
                        <div>
                            <strong class="text-dark">${index + 1}. ${restaurante.nombre}</strong><br>
                            <small class="text-muted">ID: ${restaurante.id}</small> 
                        </div>
                        <button class="btn btn-sm btn-outline-primary rounded-pill">Ver</button>
                    </li>
                `;
                        });
                    } else {
                        listaRestaurantes.innerHTML = '<li class="list-group-item bg-amarillo text-muted text-center small">Aún no tienes favoritos.</li>';
                    }
                }


                if (bandera && usuario.codigo_iso) {
                    bandera.src = `https://flagsapi.com/${usuario.codigo_iso}/flat/24.png`;
                }

                const enlacePerfil = document.getElementById('enlacePerfil');
                if (enlacePerfil) {
                    document.getElementById('nombrePerfil').textContent = usuario.nombre;
                    document.getElementById('textoSecundarioPerfil').textContent = 'Ver Perfil';
                    document.getElementById('imgPerfil').src = `https://ui-avatars.com/api/?name=${usuario.nombre.replace(' ', '+')}&background=1a4d8c&color=fff&rounded=true`;
                    enlacePerfil.href = 'perfil.html';
                }

                const formPerfil = document.getElementById('formPerfil');
                if (formPerfil) {
                    const displayNombre = document.getElementById('displayNombre');
                    const displayAvatar = document.getElementById('displayAvatar');

                    if (displayNombre) displayNombre.textContent = usuario.nombre;
                    if (displayAvatar) displayAvatar.src = `https://ui-avatars.com/api/?name=${usuario.nombre.replace(' ', '+')}&background=1a4d8c&color=fff&rounded=true`;
                    document.getElementById('editNombre').value = usuario.nombre;
                    document.getElementById('editEmail').value = usuario.email;
                    if (usuario.pais_id) document.getElementById('editPais').value = usuario.pais_id;

                    formPerfil.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const nombre = document.getElementById('editNombre').value;
                        const email = document.getElementById('editEmail').value;
                        const pais_id = document.getElementById('editPais').value;
                        const password = document.getElementById('editPassword').value;

                        try {
                            const putResponse = await fetch('http://localhost:3000/api/usuarios/perfil', {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ nombre, email, pais_id, password })
                            });

                            const data = await putResponse.json();
                            if (putResponse.ok) {
                                mensajePerfil.textContent = "¡Datos actualizados correctamente!";
                                mensajePerfil.className = "text-success text-center mt-3 small fw-bold";
                                document.getElementById('editPassword').value = '';

                                if (displayNombre) displayNombre.textContent = nombre;
                                if (displayAvatar) displayAvatar.src = `https://ui-avatars.com/api/?name=${nombre.replace(' ', '+')}&background=1a4d8c&color=fff&rounded=true`;

                                setTimeout(() => { mensajePerfil.textContent = ''; }, 3000);
                            } else {
                                mensajePerfil.textContent = data.error;
                                mensajePerfil.className = "text-danger text-center mt-3 small fw-bold";
                            }
                        } catch (error) {
                            mensajePerfil.textContent = "Error de conexión";
                        }
                    });
                }
            } else {
                localStorage.removeItem('hogaranza_token');
                if (window.location.pathname.includes('perfil.html')) {
                    window.location.href = 'login.html';
                }
            }
        } catch (error) {
            console.error('Error verificando sesión:', error);
        }
    }

    const contenedorMapa = document.getElementById('map');
    if (contenedorMapa && typeof maplibregl !== 'undefined') {
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
            center: [-100.3167, 25.6667],
            zoom: 12
        });

        map.addControl(new maplibregl.NavigationControl());

        cargarPinesEnMapa('http://localhost:3000/api/restaurantes');

        map.on('click', (e) => {
            const lng = e.lngLat.lng;
            const lat = e.lngLat.lat;

            const coordDisplay = document.getElementById('coordDisplay');
            if (coordDisplay) coordDisplay.innerText = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            const addLat = document.getElementById('addLat');
            if (addLat) addLat.value = lat;

            const addLng = document.getElementById('addLng');
            if (addLng) addLng.value = lng;

            const addNombre = document.getElementById('addNombre');
            if (addNombre) addNombre.value = '';

            const addMensaje = document.getElementById('addMensaje');
            if (addMensaje) addMensaje.innerText = '';

            const modalElement = document.getElementById('agregarRestauranteModal');
            if (modalElement) {
                const modalInstancia = new bootstrap.Modal(modalElement);
                modalInstancia.show();
            }
        });
    }
});

async function cargarPinesEnMapa(url) {
    try {
        marcadoresActuales.forEach(marcador => marcador.remove());
        marcadoresActuales = [];

        const respuesta = await fetch(url);
        const restaurantes = await respuesta.json();

        if (!respuesta.ok) {
            console.error("El backend devolvió un error:", restaurantes);
            return;
        }

        restaurantes.forEach(restaurante => {
            const coordenadas = [restaurante.longitud, restaurante.latitud];

            const marcador = new maplibregl.Marker({ color: "#1a4d8c" })
                .setLngLat(coordenadas)
                .addTo(map);

            marcador.getElement().style.cursor = 'pointer';

           marcador.getElement().addEventListener('click', async () => {

                document.getElementById('modal-nombre').innerText = restaurante.nombre;
                document.getElementById('btnAbrirAgregarPlatillo').setAttribute('data-id', restaurante.id);
                
                const btnFavorito = document.getElementById('btnFavorito');
                btnFavorito.setAttribute('data-id', restaurante.id);
                const iconoCorazon = document.getElementById('iconoCorazon');
                iconoCorazon.innerText = '♡'; 
                btnFavorito.classList.remove('btn-danger');
                btnFavorito.classList.add('btn-light');

                const token = localStorage.getItem('hogaranza_token');
                if (token) {
                    try {
                        const resPerfil = await fetch('http://localhost:3000/api/usuarios/perfil', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (resPerfil.ok) {
                            const usuario = await resPerfil.json();
                            const esFavorito = usuario.restaurantesFavoritos.some(fav => fav.id === restaurante.id);
                            if (esFavorito) {
                                iconoCorazon.innerText = '❤︎⁠';
                                btnFavorito.classList.remove('btn-light');
                                btnFavorito.classList.add('btn-danger');
                            }
                        }
                    } catch (e) { console.error("Error verificando favoritos", e); }
                }

               
                const listaPlatillos = document.getElementById('modal-lista-platillos');
                listaPlatillos.innerHTML = '';

                if (restaurante.menu && restaurante.menu.length > 0) {

                    restaurante.menu.forEach(platillo => {
                        const precio = platillo.MenuRestaurante && platillo.MenuRestaurante.precio
                            ? `$${platillo.MenuRestaurante.precio}`
                            : 'Precio variable';

                        const li = document.createElement('li');
                        li.className = 'list-group-item px-3 bg-celeste d-flex justify-content-between align-items-center mb-2  rounded-3 border-0';

                        li.innerHTML = `
                            <div>
                                <strong>🍽️ ${platillo.nombre}</strong> <br>
                                <small class="text-muted">${platillo.descripcion || 'Especialidad de la casa'}</small>
                            </div>
                            <div class="text-end">
                                <span class="badge bg-primary rounded-pill fs-6">${precio}</span>
                            </div>
                        `;
                        listaPlatillos.appendChild(li);
                    });

                } else {
                    listaPlatillos.innerHTML = `
                        <li class="list-group-item px-3 bg-celeste text-muted text-center rounded-3 border-0">
                            Aún no hay platillos registrados en el menú.
                        </li>`;
                }

                const modalElement = document.getElementById('restauranteModal');
                const modalInstancia = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modalInstancia.show();
            });

            marcadoresActuales.push(marcador);
        });

        if (restaurantes.length > 0) {
            map.flyTo({
                center: [restaurantes[restaurantes.length - 1].longitud, restaurantes[restaurantes.length - 1].latitud],
                zoom: 13
            });
        }
    } catch (error) {
        console.error("Error al cargar los pines:", error);
    }
}



function buscarPuentes() {
    const paisIso = document.getElementById('nacionalidad').value;
    const busqueda = document.getElementById('site-search').value;

    const checkboxes = document.querySelectorAll('.filtro-categoria:checked');
    const categoriasIds = Array.from(checkboxes).map(cb => cb.value).join(',');

    let urlFiltro = `http://localhost:3000/api/restaurantes/filtrar?`;

    if (paisIso) urlFiltro += `pais=${paisIso}&`;
    if (busqueda) urlFiltro += `q=${encodeURIComponent(busqueda)}&`;
    if (categoriasIds) urlFiltro += `categorias=${categoriasIds}&`;

    urlFiltro = urlFiltro.slice(0, -1);
    cargarPinesEnMapa(urlFiltro);
}
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const pais_id = document.getElementById('pais').value;
        const mensajeError = document.getElementById('mensajeError');

        mensajeError.textContent = '';

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, pais_id })
            });

            const data = await response.json();
            if (response.ok) {
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                window.location.href = 'login.html';
            } else {
                mensajeError.textContent = data.error;
            }
        } catch (error) {
            mensajeError.textContent = 'Error de conexión con el servidor.';
        }
    });
}

const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const mensajeErrorLogin = document.getElementById('mensajeErrorLogin');

        mensajeErrorLogin.textContent = '';

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('hogaranza_token', data.token);
                alert('¡Bienvenido a Hogaranza!');
                window.location.href = 'index.html';
            } else {
                mensajeErrorLogin.textContent = data.error;
            }
        } catch (error) {
            mensajeErrorLogin.textContent = 'Error de conexión con el servidor.';
        }
    });
}

const formAgregarRestaurante = document.getElementById('formAgregarRestaurante');
if (formAgregarRestaurante) {
    formAgregarRestaurante.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('addNombre').value;
        const latitud = document.getElementById('addLat').value;
        const longitud = document.getElementById('addLng').value;
        const sede_id = document.getElementById('addSede').value;

        const mensajeDiv = document.getElementById('addMensaje');
        mensajeDiv.innerText = "Guardando...";
        mensajeDiv.className = "text-primary small";

        try {
            const response = await fetch('http://localhost:3000/api/restaurantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, latitud, longitud, sede_id })
            });

            if (response.ok) {
                const modalElement = document.getElementById('agregarRestauranteModal');
                const modalInstancia = bootstrap.Modal.getInstance(modalElement);
                modalInstancia.hide();

                cargarPinesEnMapa('http://localhost:3000/api/restaurantes');
                alert('📍 ¡Restaurante agregado al mapa!');
            } else {
                const data = await response.json();
                mensajeDiv.innerText = data.error || "Error al guardar";
                mensajeDiv.className = "text-danger small fw-bold";
            }
        } catch (error) {
            mensajeDiv.innerText = "Error de conexión al servidor";
            mensajeDiv.className = "text-danger small fw-bold";
        }
    });
}

function cerrarSesion() {
    localStorage.removeItem('hogaranza_token');
    window.location.href = 'perfil.html';
}

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btnAbrirAgregarPlatillo') {
        const restauranteId = e.target.getAttribute('data-id');
        document.getElementById('platilloRestauranteId').value = restauranteId;

        bootstrap.Modal.getInstance(document.getElementById('restauranteModal')).hide();
        new bootstrap.Modal(document.getElementById('agregarPlatilloModal')).show();

        const selectNacionalidad = document.getElementById('nacionalidad');
        const selectPaisPlatillo = document.getElementById('platilloPais');
        selectPaisPlatillo.innerHTML = selectNacionalidad.innerHTML;
        selectPaisPlatillo.options[0].text = "Selecciona el origen...";
    }
});

const formAgregarPlatillo = document.getElementById('formAgregarPlatillo');
if (formAgregarPlatillo) {
    formAgregarPlatillo.addEventListener('submit', async (e) => {
        e.preventDefault();

        const restauranteId = document.getElementById('platilloRestauranteId').value;
        const nombre = document.getElementById('platilloNombre').value;
        const descripcion = document.getElementById('platilloDesc').value;
        const precio = document.getElementById('platilloPrecio').value;
        const codigo_iso = document.getElementById('platilloPais').value;

        const mensajeDiv = document.getElementById('msgPlatillo');
        mensajeDiv.innerText = "Guardando...";
        mensajeDiv.className = "text-primary small fw-bold mt-2";

        try {
            const response = await fetch(`http://localhost:3000/api/restaurantes/${restauranteId}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, precio, codigo_iso })
            });

            if (response.ok) {
                const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('agregarPlatilloModal'));
                modalInstancia.hide();

                formAgregarPlatillo.reset();

                cargarPinesEnMapa('http://localhost:3000/api/restaurantes');
                alert('🍽️ ¡Platillo agregado al menú!');
            } else {
                const data = await response.json();
                mensajeDiv.innerText = data.error || "Error al guardar";
                mensajeDiv.className = "text-danger small fw-bold mt-2";
            }
        } catch (error) {
            mensajeDiv.innerText = "Error de conexión al servidor";
            mensajeDiv.className = "text-danger small fw-bold mt-2";
        }
    });
}

document.addEventListener('click', async (e) => {
    const btnFavorito = e.target.closest('#btnFavorito');
    
    if (btnFavorito) {
        const token = localStorage.getItem('hogaranza_token');
        
        if (!token) {
            alert("Debes iniciar sesión para agregar favoritos.");
            window.location.href = 'login.html';
            return;
        }

        const restauranteId = btnFavorito.getAttribute('data-id');
        const iconoCorazon = document.getElementById('iconoCorazon');
        const esFavoritoActualmente = iconoCorazon.innerText === '❤︎⁠';
        
        btnFavorito.disabled = true;

        try {
            const metodo = esFavoritoActualmente ? 'DELETE' : 'POST';
            
            const response = await fetch(`http://localhost:3000/api/usuarios/favoritos/${restauranteId}`, {
                method: metodo,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                if (esFavoritoActualmente) {
                    iconoCorazon.innerText = '♡';
                    btnFavorito.classList.remove('btn-danger');
                    btnFavorito.classList.add('btn-light');
                } else {
                    iconoCorazon.innerText = '❤︎⁠';
                    btnFavorito.classList.remove('btn-light');
                    btnFavorito.classList.add('btn-danger');
                }
            } else {
                alert("Hubo un problema al actualizar favoritos.");
            }
        } catch (error) {
            console.error("Error al procesar favorito:", error);
            alert("Error de conexión.");
        } finally {
            btnFavorito.disabled = false; 
        }
    }
});