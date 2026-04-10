<<<<<<< Updated upstream
const map = new maplibregl.Map({
  container: 'map', 
  style: 'https://tiles.openfreemap.org/styles/liberty', 
  center: [-100.3167, 25.6667], 
  zoom: 12
});
=======
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
                headers: {
                    'Content-Type': 'application/json'
                },
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
            console.error('Error de conexión:', error);
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
                headers: {
                    'Content-Type': 'application/json'
                },
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
            console.error('Error de conexión:', error);
            mensajeErrorLogin.textContent = 'Error de conexión con el servidor.';
        }
    });
}

>>>>>>> Stashed changes

// ==========================================
// LÓGICA DEL MAPA Y PINES (Protegida)
// ==========================================

<<<<<<< Updated upstream
function agregarMarcador(lng, lat, nombre, descripcion) {
  const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`<h6>${nombre}</h6><p class="small">${descripcion}</p>`);

  new maplibregl.Marker({ color: '#1a4d8c' }) 
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map);
=======
// Primero verificamos si el contenedor del mapa y la librería existen en la página actual
const contenedorMapa = document.getElementById('map');

if (contenedorMapa && typeof maplibregl !== 'undefined') {

    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [-100.3167, 25.6667],
        zoom: 12
    });

    map.addControl(new maplibregl.NavigationControl());

    function agregarMarcador(lng, lat, nombre, descripcion) {
        const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`<h6>${nombre}</h6><p class="small">${descripcion}</p>`);

        new maplibregl.Marker({ color: '#1a4d8c' })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);
    }

    const restauranteEjemplo = {
        lng: -100.3167,
        lat: 25.6667,
        nombre: "tacos \"el Pro\"",
        ubicacion: "MTY",
        rating: "3/5",
        platillos: [
            {
                icono: "(づ•ᴗ•)づᯓ. ݁₊ ⊹ .🌮  ݁˖ . ݁",
                nombre: "Campechana",
                descripcion: "mezcla de un pirata y gringa",
                codigoPaisTop: "UG"
            },
            {
                icono: "(づ•ᴗ•)づᯓ. ݁₊ ⊹ .🌮  ݁˖ . ݁",
                nombre: "Tacos de bistec",
                descripcion: "clasicos tacos de carne asada",
                codigoPaisTop: "KR"
            }
        ]
    };

    function agregarPin(restaurante) {
        const marker = new maplibregl.Marker({ color: '#d1ecf1' })
            .setLngLat([restaurante.lng, restaurante.lat])
            .addTo(map);

        marker.getElement().addEventListener('click', () => {
            document.getElementById('modal-nombre').innerText = restaurante.nombre;
            document.getElementById('modal-ubicacion').innerText = restaurante.ubicacion;
            document.getElementById('modal-rating').innerText = restaurante.rating;

            const listaPlatillos = document.getElementById('modal-lista-platillos');
            listaPlatillos.innerHTML = '';
            restaurante.platillos.forEach(platillo => {
                const urlBandera = `https://flagsapi.com/${platillo.codigoPaisTop}/flat/24.png`;
                const li = document.createElement('li');
                li.className = 'list-group-item px-3 bg-celeste d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        ${platillo.icono} <strong>${platillo.nombre}</strong> <br>
                        <small class="text-muted">${platillo.descripcion}</small>
                    </div>
                    <div class="text-end" title="Mejor calificado por este país">
                        <small class="d-block" style="font-size: 0.7rem;">Top Rating</small>
                        <img src="${urlBandera}" alt="Bandera">
                    </div>
                `;
                listaPlatillos.appendChild(li);
            });

            const modalElement = document.getElementById('restauranteModal');
            const modalInstancia = new bootstrap.Modal(modalElement);
            modalInstancia.show();
        });

        marker.getElement().style.cursor = 'pointer';
    }

    map.on('load', () => {
        agregarPin(restauranteEjemplo);
    });

>>>>>>> Stashed changes
}

async function cargarPaises() {
    try {
        
        const respuesta = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations');
        let paises = await respuesta.json();
        paises.sort((a, b) => a.translations.spa.common.localeCompare(b.translations.spa.common));
        const selectNacionalidad = document.getElementById('nacionalidad');
        selectNacionalidad.innerHTML = '<option value="">¿de que pais quires comer? (•⤙•)</option>';
        paises.forEach(pais => {
            const codigo = pais.cca2;
            const nombreEspanol = pais.translations.spa.common; 
            const opcion = document.createElement('option');
            opcion.value = codigo; 
            opcion.textContent = nombreEspanol; 

            selectNacionalidad.appendChild(opcion);
        });

    } catch (error) {
        console.error(error);
    
    }
}

document.addEventListener('DOMContentLoaded', cargarPaises);

<<<<<<< Updated upstream
const restauranteEjemplo = {
    lng: -100.3167,
    lat: 25.6667,
    nombre: "tacos \"el Pro\"",
    ubicacion: "MTY",
    rating: "3/5",
    platillos: [
        { 
            icono: "(づ•ᴗ•)づᯓ. ݁₊ ⊹ .🌮  ݁˖ . ݁", 
            nombre: "Campechana", 
            descripcion: "mezcla de un pirata y gringa", 
            codigoPaisTop: "UG" 
        },
        { 
            icono: "(づ•ᴗ•)づᯓ. ݁₊ ⊹ .🌮  ݁˖ . ݁", 
            nombre: "Tacos de bistec", 
            descripcion: "clasicos tacos de carne asada", 
            codigoPaisTop: "KR"
        }
    ]
};

function agregarPin(restaurante) {

    const marker = new maplibregl.Marker({ color: '#d1ecf1' })
        .setLngLat([restaurante.lng, restaurante.lat])
        .addTo(map);

    marker.getElement().addEventListener('click', () => {
        
        document.getElementById('modal-nombre').innerText = restaurante.nombre;
        document.getElementById('modal-ubicacion').innerText = restaurante.ubicacion;
        document.getElementById('modal-rating').innerText = restaurante.rating;

        const listaPlatillos = document.getElementById('modal-lista-platillos');
        listaPlatillos.innerHTML = ''; 
        restaurante.platillos.forEach(platillo => {
            const urlBandera = `https://flagsapi.com/${platillo.codigoPaisTop}/flat/24.png`;
     
            const li = document.createElement('li');
            li.className = 'list-group-item px-3 bg-celeste d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    ${platillo.icono} <strong>${platillo.nombre}</strong> <br>
                    <small class="text-muted">${platillo.descripcion}</small>
                </div>
                <div class="text-end" title="Mejor calificado por este país">
                    <small class="d-block" style="font-size: 0.7rem;">Top Rating</small>
                    <img src="${urlBandera}" alt="Bandera">
                </div>
            `;
            listaPlatillos.appendChild(li);
        });

        const modalElement = document.getElementById('restauranteModal');
        const modalInstancia = new bootstrap.Modal(modalElement);
        modalInstancia.show();
    });

    marker.getElement().style.cursor = 'pointer';
}

map.on('load', () => {
    agregarPin(restauranteEjemplo);
});
=======



document.addEventListener('DOMContentLoaded', async () => {
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
                console.log("USUARIO:", usuario);
                const bandera = document.getElementById('displayBandera');

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


});

function cerrarSesion() {
    localStorage.removeItem('hogaranza_token');
    window.location.href = 'perfil.html';
}
>>>>>>> Stashed changes
