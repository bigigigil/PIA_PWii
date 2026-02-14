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