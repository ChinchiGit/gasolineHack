//VARIABLES
let gasolinerasBruto;
let gasolinerasDepurado1 = [];
let gasolinerasDepurado2 = [];
let latitudUser;
let longitudUser;
let buscarProvincia = document.getElementById("eleccionUsuario");
let provinciaElegida;
let combustibleElegido;
let localidadElegida;
let gasolinerasProvincia = [];
let botonRadio = document.getElementById("eleccionRadio")
let radioElegido;
let gasolinerasRadio = [];

// ******** DECLARACION DE FUNCIONES********

//LLAMADA FECTH
async function getGasolineras() {
  await fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/')
    .then(res => res.json())
    .then(gasolineras => {
      gasolinerasBruto = gasolineras.ListaEESSPrecio;
      console.log(gasolinerasBruto);

    })
}


// DEPURACION 1 DEL OBJETO:ELIMINAR GASOLINERAS SIN VENTA AL PUBLIDO (SOLO A COOPERATIVISTAS Y SOCIOS)
function depurar1() {
  for (let i = 0; i < gasolinerasBruto.length; i++) {
    if (gasolinerasBruto[i]["Tipo Venta"] == "P") {

      gasolinerasDepurado1.push(gasolinerasBruto[i]);
    }
  }
};

// DEPURACION 2 CONVERTIR LOS STRINGS DE PRECIOS Y GEOLOCALIZACION A NUMERO Y ELIMINAR LOS "NaN" 
function depurar2() {
  for (let i = 0; i < gasolinerasDepurado1.length; i++) {
    gasolinerasDepurado1[i]["Precio Gasoleo A"] = gasolinerasDepurado1[i]["Precio Gasoleo A"].replace(",", ".");
    gasolinerasDepurado1[i]["Precio Gasoleo A"] = Number(gasolinerasDepurado1[i]["Precio Gasoleo A"]);
    gasolinerasDepurado1[i]["Precio Gasolina 95 E5"] = gasolinerasDepurado1[i]["Precio Gasolina 95 E5"].replace(",", ".");
    gasolinerasDepurado1[i]["Precio Gasolina 95 E5"] = Number(gasolinerasDepurado1[i]["Precio Gasolina 95 E5"]);
    gasolinerasDepurado1[i].Latitud = gasolinerasDepurado1[i].Latitud.replace(",", ".");
    gasolinerasDepurado1[i].Latitud = Number(gasolinerasDepurado1[i].Latitud);
    gasolinerasDepurado1[i]["Longitud (WGS84)"] = gasolinerasDepurado1[i]["Longitud (WGS84)"].replace(",", ".");
    gasolinerasDepurado1[i]["Longitud (WGS84)"] = Number(gasolinerasDepurado1[i]["Longitud (WGS84)"]);

    if (gasolinerasDepurado1[i]["Precio Gasolina 95 E5"] != 0) {
      gasolinerasDepurado2.push(gasolinerasDepurado1[i])
    }

  };
}

//ACOTAR A PROVINCIA ELEGIDA POR EL USUARIO
function acotarProvincia() {
  for (let i = 0; i < gasolinerasDepurado2.length; i++) {
    if (gasolinerasDepurado2[i].Provincia == `${provinciaElegida}`) {

      gasolinerasProvincia.push(gasolinerasDepurado2[i]);

    }
  };
};

//ORDENAR POR PRECIO COMBUSTIBLE ELEGIDO
function ordenarPorPrecio(listado) {
  listado.sort(function (a, b) {
    if (a["Precio Gasolina 95 E5"] > b["Precio Gasolina 95 E5"]) {
      return 1;
    }
    if (a["Precio Gasolina 95 E5"] < b["Precio Gasolina 95 E5"]) {
      return -1;
    }

    return 0;
  });
};


// TARJETA INFO DETALLE PARA LA GASOLINERA MAS CERCANA O LA ELEGIDA POR EL USUARIO
function pintarTarjetaGasolinera(gasolinera) {

  const ul = document.createElement("ul");

  // Agrega un elemento <li> para cada campo de la gasolinera
  ul.innerHTML += `
    <li>Dirección: ${gasolinera.Dirección}</li>
    <li>Marca: ${gasolinera.Rótulo}</li>
    <li>Localidad: ${gasolinera.Localidad}</li>
    <li>Provincia: ${gasolinera.Provincia}</li>
    <li>Precio gasolina: ${gasolinera["Precio Gasolina 95 E5"]} €</li>
    <li>Precio diesel: ${gasolinera["Precio Gasoleo A"]} €</li>
    <li>Horario: ${gasolinera.Horario}</li>
    <li>Distancia: ${gasolinera.distancia} Km.</li>
  `;

  document.querySelector("#tarjetaCercana").appendChild(ul);
}


// template para pintar en DOM lista de GASOLINERAS PROVINCIA /RADIO:
function pintarTabla(listado) {

  const tbody = document.querySelector("table.tabla-gasolineras tbody");
  pintar = listado.slice(0, 10)
  console.log(pintar)
  pintar.forEach((gasolinera) => {
    const tr = document.createElement("tr");

    tr.innerHTML =
      `<td>${gasolinera.Localidad}</td>
    <td>${gasolinera.Dirección}</td>
    <td>${gasolinera.Rótulo}</td>
    <td>${gasolinera["Precio Gasolina 95 E5"]}</td>
    <td>${gasolinera["Precio Gasoleo A"]}</td>
    `;

    tbody.appendChild(tr);
  });


}

//OBTENER UBICACION DEL USUARIO 

function getUserUbication() {
  navigator.geolocation.getCurrentPosition((position) => {
    latitudUser = position.coords.latitude;
    longitudUser = position.coords.longitude;
  }, (error) => {
    // Si hay un error, lo mostramos en el consola
    console.log(error);
  });
};

//FUNCION HAVERSIN CALCULAR DISTANCIA
function distanciaHaversine(latitud1, longitud1, latitud2, longitud2) {
  const R = 6371.01 // Radio de la Tierra en kilómetros
  const φ1 = latitud1 * Math.PI / 180
  const φ2 = latitud2 * Math.PI / 180
  const Δφ = (latitud2 - latitud1) * Math.PI / 180
  const Δλ = (longitud2 - longitud1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  distancia = (R * c);
  return R * c;
}

//APLICAR HAVERSIN AL OBJETO DEVUELTO POR LA API YA FILTRADO
function getGasolineraMasCercana() {
  for (let i = 0; i<gasolinerasDepurado2.length; i++){
   distanciaHaversine(latitudUser, longitudUser, gasolinerasDepurado2[i].Latitud,gasolinerasDepurado2[i]["Longitud (WGS84)"]);
   gasolinerasDepurado2[i].distancia = distancia;
  }

}

//ORDENAR POR DISTANCIA AL USUARIO
function ordenarPorDistancia() {
  gasolinerasDepurado2.sort(function (a, b) {
    if (a["distancia"] > b["distancia"]) {
      return 1;
    }
    if (a["distancia"] < b["distancia"]) {
      return -1;
    }

    return 0;
  });
};

//ACOTAR AL RADIO DE KM ELEGIDO

function acotarRadio (){
  for (let i = 0; i<gasolinerasDepurado2.length; i++){
    if (gasolinerasDepurado2[i].distancia <= radioElegido){
      gasolinerasRadio.push(gasolinerasDepurado2[i])
    }

  }
}


//PINTAR MAPAS

//GASOLINERA MAS CERCANA O ELEGIDA POR EL USUARIO
function mapa1() {

  let map = L.map('map').setView([latitudUser, longitudUser], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      
  }).addTo(map);

  const userMarker = L.marker([latitudUser, longitudUser]).addTo(map);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0,0] // point fr5om which the popup should open relative to the iconAnchor
  })

  const gasolineraMarker = L.marker([gasolinerasDepurado2[0].Latitud, gasolinerasDepurado2[0]["Longitud (WGS84)"]], {icon : gasIcon}).addTo(map);
  gasolineraMarker.bindPopup(`<b>${gasolinerasDepurado2[0].Dirección}</b><br>Gasolina : ${gasolinerasDepurado2[0]["Precio Gasolina 95 E5"]} €<br>Diesel: ${gasolinerasDepurado2[0]["Precio Gasoleo A"]} €`).openPopup();


};



function mapaComoLLegar() {

  let map = L.map('map').setView([latitudUser, longitudUser], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 30,
      
  }).addTo(map);

  const userMarker = L.marker([latitudUser, longitudUser]).addTo(map);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0,0] // point fr5om which the popup should open relative to the iconAnchor
  })

  const gasolineraMarker = L.marker([gasolinerasDepurado2[0].Latitud, gasolinerasDepurado2[0]["Longitud (WGS84)"]], {icon : gasIcon}).addTo(map);
  gasolineraMarker.bindPopup(`<b>${gasolinerasDepurado2[0].Dirección}</b><br>Gasolina : ${gasolinerasDepurado2[0]["Precio Gasolina 95 E5"]} €<br>Diesel: ${gasolinerasDepurado2[0]["Precio Gasoleo A"]} €`).openPopup();

  L.Routing.control({
    waypoints: [
      L.latLng(latitudUser, longitudUser),
      L.latLng(gasolinerasDepurado2[0].Latitud, gasolinerasDepurado2[0]["Longitud (WGS84)"])
    ]
  }).addTo(map);


};
  


//MAPA RADIO/

function mapa2() {

  let map2 = L.map('map2').setView([latitudUser, longitudUser], 9);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      
  }).addTo(map2);

  const userMarker = L.marker([latitudUser, longitudUser]).addTo(map2);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0,0] // point fr5om which the popup should open relative to the iconAnchor
  })

  for (let i =0; i<pintar.length; i++) {
    L.marker([pintar[i].Latitud, pintar[i]["Longitud (WGS84)"]], { icon: gasIcon}).addTo(map2);
  }

};

//MAPA PROVINCIA/

function map3() {

  let map3 = L.map('map3').setView([pintar[0].Latitud, pintar[0]["Longitud (WGS84)"]], 9);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      
  }).addTo(map3);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0,0] // point fr5om which the popup should open relative to the iconAnchor
  })

  for (let i =0; i<pintar.length; i++) {
    L.marker([pintar[i].Latitud, pintar[i]["Longitud (WGS84)"]], { icon: gasIcon}).addTo(map3);
  }

};


//************ FUNCIONALIDAD PAGINAS************/


//FUNCIONALIDADES INDEX
if (document.title == "GASOLINE HACK - Home") {
  const boton01 = document.querySelector("#boton01");
  const boton02 = document.querySelector("#boton02");
  const boton03 = document.querySelector("#boton03");

  boton01.addEventListener('click', function () {
    window.location.href = './pages/singlegas.html'
  })

  boton02.addEventListener('click', function () {
    window.location.href = './pages/searchProvincia.html'
  })

  boton03.addEventListener('click', function () {
    window.location.href = './pages/searchRadio.html'
  })


}

//FUNCIONALIDADES BUSQUEDA GASOLINERAS PROVINCIA
if (document.title == "GASOLINE HACK - Gasolineras mas baratas de tu provincia") {
  let pintar;

  getUserUbication()

  //Llamada fetch y filtrado 1
  getGasolineras().then(() => {
    depurar1();
  });

  //Obtener PROVINCIA y COMBUSTIBLE elegidos por el usuario
  buscarProvincia.addEventListener("submit", function (event) {
    event.preventDefault();
    provinciaElegida = event.target.provincia.value;
    combustibleElegido = event.target.combustible.value;
    //Filtrado 2
    depurar2()
    acotarProvincia();
    ordenarPorPrecio(gasolinerasProvincia);
    pintarTabla(gasolinerasProvincia);
    map3();
  });
  

}





//FUNCIONALIDADES BUSQUEDA RADIO
if (document.title == "GASOLINE HACK - Gasolineras mas baratas cerca de tu ubicación") {
  let pintar;

  getUserUbication()

  getGasolineras().then(() => {
    depurar1();
    depurar2();
    getGasolineraMasCercana();
    ordenarPorDistancia();
  });

  const distancia = document.querySelector("#distancia");
  const radioBusqueda = document.querySelector(".radioBusqueda");

  radioBusqueda.textContent = distancia.value;

  distancia.addEventListener("input", function () {
    radioBusqueda.textContent = distancia.value;
  });

  botonRadio.addEventListener("submit", function (event) {
    event.preventDefault();
    radioElegido = event.target.distancia.value;
    acotarRadio();
    ordenarPorPrecio(gasolinerasRadio);
    pintarTabla(gasolinerasRadio);
    mapa2()
  })



}


//FUNCIONALIDAD GASOLINERA MAS CERCANA

if (document.title == "GASOLINE HACK - Tu gasolinera mas cercana"){
  
  getUserUbication()
  getGasolineras().then(() => {
    depurar1();
    depurar2();
    getGasolineraMasCercana();
    ordenarPorDistancia();
    pintarTarjetaGasolinera(gasolinerasDepurado2[0])
    mapa1()
  });

};