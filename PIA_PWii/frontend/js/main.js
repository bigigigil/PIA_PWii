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

async function cargarOpcionesBuscadoresPerfil() {
    if (!document.getElementById('datalist-platillos')) return;

    try {
        const resPlatillos = await fetch('http://localhost:3000/api/platillos');
        if (resPlatillos.ok) {
            const platillos = await resPlatillos.json();
            const dlPlatillos = document.getElementById('datalist-platillos');
            dlPlatillos.innerHTML = '';
            platillos.forEach(p => {
                const option = document.createElement('option');
                option.value = p.nombre;
                option.setAttribute('data-id', p.id);
                dlPlatillos.appendChild(option);
            });
        }

        const resPaises = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations');
        if (resPaises.ok) {
            const paises = await resPaises.json();
            paises.sort((a, b) => a.translations.spa.common.localeCompare(b.translations.spa.common));
            const dlPaises = document.getElementById('datalist-paises');
            dlPaises.innerHTML = '';
            
            paises.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais.translations.spa.common;
                option.setAttribute('data-iso', pais.cca2);
                dlPaises.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error cargando opciones de buscadores:", error);
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
    cargarOpcionesBuscadoresPerfil();

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
                const listaPlatillosPerfil = document.getElementById('lista-platillos-favoritos');
                const listaPaisesPerfil = document.getElementById('lista-paises-favoritos');

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
                        <a href="index.html?restaurante=${restaurante.id}" class="btn btn-sm btn-outline-primary rounded-pill">Ver</a>
                    </li>
                `;
                        });
                    } else {
                        listaRestaurantes.innerHTML = '<li class="list-group-item bg-amarillo text-muted text-center small">Aún no tienes favoritos.</li>';
                    }
                }

                if (listaPlatillosPerfil) {
                    listaPlatillosPerfil.innerHTML = '';
                    if (usuario.platillosFavoritos && usuario.platillosFavoritos.length > 0) {
                        usuario.platillosFavoritos.forEach((platillo, index) => {
                            listaPlatillosPerfil.innerHTML += `
                            <li class="list-group-item bg-celeste d-flex justify-content-between align-items-center item-lista">
                                <div><strong class="text-dark">${index + 1}. ${platillo.nombre}</strong></div>
                                <a href="index.html?q=${encodeURIComponent(platillo.nombre)}" class="btn btn-sm btn-outline-primary rounded-pill">Buscar</a>
                            </li>`;
                        });
                    } else {
                        listaPlatillosPerfil.innerHTML = '<li class="list-group-item bg-celeste text-muted text-center small">Aún no tienes platillos favoritos.</li>';
                    }
                }

                if (listaPaisesPerfil) {
                    listaPaisesPerfil.innerHTML = '';
                    if (usuario.paisesFavoritos && usuario.paisesFavoritos.length > 0) {
                        usuario.paisesFavoritos.forEach((p) => {
                            listaPaisesPerfil.innerHTML += `
                            <li class="list-group-item bg-amarillo d-flex justify-content-between align-items-center item-lista">
                                <div class="d-flex align-items-center">
                                    <img src="https://flagsapi.com/${p.codigo_iso}/flat/24.png" class="me-2" alt="${p.codigo_iso}">
                                    <strong class="text-dark">${p.nombre}</strong>
                                </div>
                                <a href="index.html?pais=${p.codigo_iso}" class="btn btn-sm btn-outline-primary rounded-pill">Explorar</a>
                            </li>`;
                        });
                    } else {
                        listaPaisesPerfil.innerHTML = '<li class="list-group-item bg-amarillo text-muted text-center small">Aún no tienes gastronomías favoritas.</li>';
                    }
                }

                if (bandera && usuario.codigo_iso) {
                    bandera.src = `https://flagsapi.com/${usuario.codigo_iso}/flat/24.png`;
                }

                const btnAgregarPlatillo = document.getElementById('btn-agregar-platillo-perfil');
                if (btnAgregarPlatillo) {
                    btnAgregarPlatillo.addEventListener('click', async () => {
                        const inputVal = document.getElementById('buscador-platillos-perfil').value;
                        const dl = document.getElementById('datalist-platillos');
                        const option = Array.from(dl.options).find(opt => opt.value === inputVal);
                        
                        if (!option) {
                            alert("Por favor selecciona un platillo de la lista.");
                            return;
                        }

                        const platilloId = option.getAttribute('data-id');
                        try {
                            const res = await fetch(`http://localhost:3000/api/usuarios/favoritos/platillos/${platilloId}`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                                document.getElementById('buscador-platillos-perfil').value = '';
                                window.location.reload(); 
                            } else {
                                alert("Error al agregar platillo.");
                            }
                        } catch(e) { console.error(e); }
                    });
                }

                const btnAgregarPais = document.getElementById('btn-agregar-pais-perfil');
                if (btnAgregarPais) {
                    btnAgregarPais.addEventListener('click', async () => {
                        const inputVal = document.getElementById('buscador-paises-perfil').value;
                        const dl = document.getElementById('datalist-paises');
                        const option = Array.from(dl.options).find(opt => opt.value === inputVal);
                        
                        if (!option) {
                            alert("Por favor selecciona un país de la lista.");
                            return;
                        }

                        const codigoIso = option.getAttribute('data-iso');
                        
                        try {
                            const res = await fetch(`http://localhost:3000/api/usuarios/favoritos/paises/iso/${codigoIso}`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            
                            if (res.ok) {
                                document.getElementById('buscador-paises-perfil').value = '';
                                window.location.reload();
                            } else {
                                alert("Error al agregar país.");
                            }
                        } catch(e) { console.error(e); }
                    });
                }
                const contenedorUltima = document.getElementById('contenedor-ultima-resena');
                const contenedorTodas = document.getElementById('contenedor-todas-resenas');
                const btnVerTodas = document.getElementById('btnVerTodasResenas');

                if (contenedorUltima && usuario.resenas) {

                    if (usuario.resenas.length === 0) {
                        contenedorUltima.innerHTML = '<p class="text-muted text-center italic">Aún no has escrito ninguna reseña.</p>';
                    } else {
                        const resenasOrdenadas = usuario.resenas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                        const crearTarjetaResena = (resena) => {
                            const fecha = new Date(resena.createdAt).toLocaleDateString('es-MX');
                            const nombreRestaurante = resena.Restaurante ? resena.Restaurante.nombre : 'Restaurante Desconocido';
                            const estrellas = ' ★'.repeat(resena.calificacion_estrellas);

                            return `
                                <div class="card border-0 rounded-4 mb-3 shadow-sm overflow-hidden">
                                    <div class="card-body p-4 bg-white border-start border-5" style="border-color: #fbc02d !important;">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h5 class="fw-bold text-dark mb-1">${nombreRestaurante}</h5>
                                                <p class="text-muted small mb-0">${fecha}</p>
                                            </div>
                                            <span class="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
                                                ${estrellas} ${resena.calificacion_estrellas}/5
                                            </span>
                                        </div>
                                        <p class="mt-3 mb-2 text-secondary fst-italic">"${resena.comentario}"</p>
                                    </div>
                                </div>
                            `;
                        };

                        contenedorUltima.innerHTML = crearTarjetaResena(resenasOrdenadas[0]);

                        if (resenasOrdenadas.length > 1) {
                            btnVerTodas.classList.remove('d-none');

                            let htmlTodas = '<h5 class="fw-bold text-secondary mb-3">Historial de Reseñas</h5>';
                            for (let i = 1; i < resenasOrdenadas.length; i++) {
                                htmlTodas += crearTarjetaResena(resenasOrdenadas[i]);
                            }
                            contenedorTodas.innerHTML = htmlTodas;

                            btnVerTodas.addEventListener('click', () => {
                                if (contenedorTodas.classList.contains('d-none')) {
                                    contenedorTodas.classList.remove('d-none');
                                    btnVerTodas.innerText = 'Ocultar reseñas ⬆';
                                } else {
                                    contenedorTodas.classList.add('d-none');
                                    btnVerTodas.innerText = 'Ver todas mis reseñas ⬇';
                                }
                            });
                        }
                    }
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
    const urlParams = new URLSearchParams(window.location.search);
    const restauranteDestacado = urlParams.get('restaurante');
    const paisFiltro = urlParams.get('pais');
    const busquedaFiltro = urlParams.get('q');
    if (paisFiltro) {
        setTimeout(() => {
            const selectNacionalidad = document.getElementById('nacionalidad');
            if (selectNacionalidad) selectNacionalidad.value = paisFiltro;
        }, 500);
    }
    if (busquedaFiltro) {
        const inputSearch = document.getElementById('site-search');
        if (inputSearch) inputSearch.value = busquedaFiltro;
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
                let textoRating = " ★ Nuevo";
                if (restaurante.menu && restaurante.menu.length > 0) {
                    const suma = restaurante.resenas.reduce((acc, curr) => acc + curr.calificacion_estrellas, 0);
                    const promedio = (suma / restaurante.resenas.length).toFixed(1);
                    textoRating = ` ★ ${promedio} (${restaurante.resenas.length} reseñas)`;
                    const menuAgrupado = {};
                    restaurante.menu.forEach(platillo => {
                        const nombreCategoria = (platillo.categorias && platillo.categorias.length > 0)
                            ? platillo.categorias[0].nombre
                            : 'Especialidades de la Casa';

                        if (!menuAgrupado[nombreCategoria]) menuAgrupado[nombreCategoria] = [];
                        menuAgrupado[nombreCategoria].push(platillo);
                    });
                    for (const [categoria, platillos] of Object.entries(menuAgrupado)) {
                        const tituloSeccion = document.createElement('h6');
                        tituloSeccion.className = 'fw-bold text-primary mt-4 mb-2 border-bottom border-primary pb-1';
                        tituloSeccion.innerHTML = `‧₊˚ 𓇋 ${categoria} 𐂐⋆.˚`;
                        listaPlatillos.appendChild(tituloSeccion);

                        platillos.forEach(platillo => {
                            const precio = platillo.MenuRestaurante && platillo.MenuRestaurante.precio
                                ? `$${platillo.MenuRestaurante.precio}` : 'Variable';
                            const bandera = platillo.pais ? `<img src="https://flagsapi.com/${platillo.pais.codigo_iso}/flat/24.png" title="${platillo.pais.codigo_iso}">` : '';

                            const li = document.createElement('li');
                            li.className = 'list-group-item px-2 bg-transparent d-flex justify-content-between align-items-start mb-1 border-0';

                            li.innerHTML = `
                                <div>
                                    <strong class="text-dark">${platillo.nombre}</strong> ${bandera}<br>
                                    <small class="text-muted" style="font-size: 0.8rem;">${platillo.descripcion || ''}</small>
                                </div>
                                <div class="text-end ms-2">
                                    <span class="text-success fw-bold">${precio}</span>
                                </div>
                            `;
                            listaPlatillos.appendChild(li);
                        });
                    }
                } else {
                    listaPlatillos.innerHTML = '<li class="list-group-item px-3 bg-celeste text-muted text-center rounded-3 border-0">Menú en construcción 👨‍🍳</li>';
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
        restaurantes.forEach(restaurante => {
            const coordenadas = [restaurante.longitud, restaurante.latitud];

            const marcador = new maplibregl.Marker({ color: "#1a4d8c" })
                .setLngLat(coordenadas)
                .addTo(map);

            marcador.getElement().style.cursor = 'pointer';

            marcador.getElement().addEventListener('click', clickEvent);
            marcadoresActuales.push(marcador);

            const urlParams = new URLSearchParams(window.location.search);
            const restauranteDestacado = urlParams.get('restaurante');

            if (restauranteDestacado && restaurante.id.toString() === restauranteDestacado) {
                map.flyTo({ center: coordenadas, zoom: 15 });
                setTimeout(clickEvent, 500); 
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (restaurantes.length > 0 && !urlParams.get('restaurante')) {
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

        const selectCategoria = document.getElementById('platilloCategoria');
        selectCategoria.innerHTML = '<option value="" selected disabled>Elige una categoría...</option>';
        document.querySelectorAll('.filtro-categoria').forEach(checkbox => {
            selectCategoria.innerHTML += `<option value="${checkbox.value}">${checkbox.nextElementSibling.innerText}</option>`;
        });
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
        const categoria_id = document.getElementById('platilloCategoria').value;

        const mensajeDiv = document.getElementById('msgPlatillo');
        mensajeDiv.innerText = "Guardando...";
        mensajeDiv.className = "text-primary small fw-bold mt-2";

        try {
            const response = await fetch(`http://localhost:3000/api/restaurantes/${restauranteId}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, precio, codigo_iso, categoria_id })

            });

            if (response.ok) {
                const modalInstancia = bootstrap.Modal.getInstance(document.getElementById('agregarPlatilloModal'));
                modalInstancia.hide();

                formAgregarPlatillo.reset();

                cargarPinesEnMapa('http://localhost:3000/api/restaurantes');
                alert('🍽️¡Platillo agregado al menú!');
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

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btnAbrirAgregarResena') {
        const token = localStorage.getItem('hogaranza_token');
        if (!token) {
            alert("Debes iniciar sesión para calificar.");
            window.location.href = 'login.html';
            return;
        }

        const restauranteId = document.getElementById('btnAbrirAgregarPlatillo').getAttribute('data-id');
        document.getElementById('resenaRestauranteId').value = restauranteId;

        bootstrap.Modal.getInstance(document.getElementById('restauranteModal')).hide();
        new bootstrap.Modal(document.getElementById('agregarResenaModal')).show();
    }
});


const formAgregarResena = document.getElementById('formAgregarResena');
if (formAgregarResena) {
    formAgregarResena.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('hogaranza_token');
        const restauranteId = document.getElementById('resenaRestauranteId').value;

        const estrellaSeleccionada = document.querySelector('input[name="rating"]:checked');
        const calificacion_estrellas = estrellaSeleccionada ? estrellaSeleccionada.value : null;

        if (!calificacion_estrellas) {
            document.getElementById('msgResena').innerText = "Por favor selecciona una calificación.";
            document.getElementById('msgResena').className = "text-danger small fw-bold mt-2";
            return;
        }

        const comentario = document.getElementById('resenaComentario').value;
        const mensajeDiv = document.getElementById('msgResena');

        mensajeDiv.innerText = "Enviando...";

        try {
            const response = await fetch(`http://localhost:3000/api/restaurantes/${restauranteId}/resenas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ calificacion_estrellas, comentario })
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('agregarResenaModal')).hide();
                formAgregarResena.reset();
                cargarPinesEnMapa('http://localhost:3000/api/restaurantes');
                alert('٩(ˊᗜˋ*)و₊˚⊹☆¡Gracias por tu reseña!');
            } else {
                mensajeDiv.innerText = "Error al guardar reseña";
            }
        } catch (error) {
            mensajeDiv.innerText = "Error de conexión";
        }
    });
}