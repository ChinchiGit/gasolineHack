//VARIABLES
let gasolinerasBruto;
let gasolinerasDepurado1 = [];
let gasolinerasDepurado2 = [];
let latitudUser;
let longitudUser;
let buscarProvincia = document.getElementById("eleccionUsuario");
let provinciaElegida;
let combustibleElegido;
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

    if (gasolinerasDepurado1[i]["Precio Gasolina 95 E5"] != 0 && gasolinerasDepurado1[i]["Precio Gasoleo A"] != 0) {
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

//ORDENAR POR PRECIO GASOLINA
function ordenarPorPrecio(listado) {
  listado.sort(function (a, b) {
    if (a[`${combustibleElegido}`] > b[`${combustibleElegido}`]) {
      return 1;
    }
    if (a[`${combustibleElegido}`] < b[`${combustibleElegido}`]) {
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
  let counter = -1;
  const tbody = document.querySelector("table.tabla-gasolineras tbody");
  pintar = listado.slice(0, 10)
  console.log(pintar)
  pintar.forEach((gasolinera) => {
    const tr = document.createElement("tr");
    counter++
    console.log(counter)
    tr.innerHTML =
      `<td>${gasolinera.Localidad}</td>
    <td>${gasolinera.Dirección}</td>
    <td>${gasolinera[combustibleElegido]} € <input type="radio" name="gasolineraSeleccionada" value = ${counter} required></td>
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
function getGasolineraMasCercana(listado) {
  for (let i = 0; i < listado.length; i++) {
    distanciaHaversine(latitudUser, longitudUser, listado[i].Latitud, listado[i]["Longitud (WGS84)"]);
    listado[i].distancia = distancia;
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

function acotarRadio() {
  for (let i = 0; i < gasolinerasDepurado2.length; i++) {
    if (gasolinerasDepurado2[i].distancia <= radioElegido) {
      gasolinerasRadio.push(gasolinerasDepurado2[i])
    }

  }
}


//PINTAR MAPAS

//GASOLINERA MAS CERCANA O ELEGIDA POR EL USUARIO
function mapa1(listado, n) {

  let map = L.map('map').setView([listado[n].Latitud, listado[n]["Longitud (WGS84)"]], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,

  }).addTo(map);

  const userMarker = L.marker([latitudUser, longitudUser]).addTo(map);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
  })

  const gasolineraMarker = L.marker([listado[n].Latitud, listado[n]["Longitud (WGS84)"]], { icon: gasIcon }).addTo(map);
  gasolineraMarker.bindPopup(`<b>${listado[n].Dirección}</b><br>Gasolina : ${listado[n]["Precio Gasolina 95 E5"]} €<br>Diesel: ${listado[n]["Precio Gasoleo A"]} €`).openPopup();

};



function mapaComoLLegar(listado, n) {

  let map4 = L.map('map4').setView([latitudUser, longitudUser], 15);

  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,

  }).addTo(map4);

  const userMarker = L.marker([latitudUser, longitudUser]).addTo(map4);

  let gasIcon = L.icon({
    iconUrl: '../assets/img/dispenser.png',
    iconSize: [55, 55], // size of the icon
    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
  })

  const gasolineraMarker = L.marker([listado[n].Latitud, listado[n]["Longitud (WGS84)"]], { icon: gasIcon }).addTo(map4);
 
  L.Routing.control({
    waypoints: [
      L.latLng(latitudUser, longitudUser),
      L.latLng(listado[n].Latitud, listado[n]["Longitud (WGS84)"])
    ]
  }).addTo(map4);


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
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
  })

  for (let i = 0; i < pintar.length; i++) {
    L.marker([pintar[i].Latitud, pintar[i]["Longitud (WGS84)"]], { icon: gasIcon }).addTo(map2);
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
    popupAnchor: [0, 0] // point fr5om which the popup should open relative to the iconAnchor
  })

  for (let i = 0; i < pintar.length; i++) {
    L.marker([pintar[i].Latitud, pintar[i]["Longitud (WGS84)"]], { icon: gasIcon }).addTo(map3);
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
  let gasolineraSeleccionada;
  let combustible;
  let mensaje

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
    if(combustibleElegido == "Precio Gasolina 95 E5"){
      combustible = "GASOLINA";
    } else  {combustible = "DIESEL"};
    mensaje = `GASOLINERAS MAS BARATAS DE ${provinciaElegida} </br>COMBUSTIBLE: ${combustible}`;
    document.getElementById("mensaje").innerHTML = mensaje;
    document.getElementById("seleccionProvincia").style.display = "none";
    document.getElementById("listaProvincia").style.display = "flex";

    //Filtrado 2
    depurar2();
    acotarProvincia();
    getGasolineraMasCercana(gasolinerasProvincia)
    ordenarPorPrecio(gasolinerasProvincia)
    pintarTabla(gasolinerasProvincia);
    map3();

  });

  //OBTENER GASOLINERA ELEGIDA
  const radio = document.getElementById("radius");
  radio.addEventListener("submit",function (event) {
    event.preventDefault();
    gasolineraSeleccionada = event.target.gasolineraSeleccionada.value;
    document.getElementById("listaProvincia").style.display = "none";
    document.getElementById("vistaUnica").style.display = "flex";
    document.getElementById("mensaje2").innerHTML = "GASOLINERA SELECIONADA";
    pintarTarjetaGasolinera(gasolinerasProvincia[gasolineraSeleccionada]);
    mapa1(gasolinerasProvincia, gasolineraSeleccionada);
  
  });
  
  let comoLlegar = document.getElementById("mostrarMapaP");
  comoLlegar.onclick = function(){
    mapaComoLLegar(gasolinerasProvincia, gasolineraSeleccionada)
  
    document.getElementById("map").style.display = "none";
    document.getElementById("map4").style.display = "block";
  }


}





//FUNCIONALIDADES BUSQUEDA RADIO
if (document.title == "GASOLINE HACK - Gasolineras mas baratas cerca de tu ubicación") {
  let pintar;

  getUserUbication()

  getGasolineras().then(() => {
    depurar1();
    depurar2();
    getGasolineraMasCercana(gasolinerasDepurado2);
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
    combustibleElegido = event.target.combustible.value;
    if(combustibleElegido == "Precio Gasolina 95 E5"){
      combustible = "GASOLINA";
    } else  {combustible = "DIESEL"};
    let mensaje = `GASOLINERAS MAS BARATAS EN UN RADIO DE ${radioElegido} KM </br>COMBUSTIBLE: ${combustible}`;
    document.getElementById("mensaje").innerHTML = mensaje;

    document.getElementById("seleccionRadio").style.display = "none";
    document.getElementById("listaProvincia").style.display = "flex";

    acotarRadio();
    ordenarPorPrecio(gasolinerasRadio);
    pintarTabla(gasolinerasRadio);
    mapa2();
  });

  // //OBTENER GASOLINERA ELEGIDA
  const select = document.getElementById("radius");
  select.addEventListener("submit",function (event) {
    event.preventDefault();
    gasolineraSeleccionada = event.target.gasolineraSeleccionada.value;
    document.getElementById("mensaje2").innerHTML = "GASOLINERA SELECIONADA";
    document.getElementById("listaProvincia").style.display = "none";
    document.getElementById("vistaUnica").style.display = "flex";
    pintarTarjetaGasolinera(gasolinerasRadio[gasolineraSeleccionada]);
    mapa1(gasolinerasRadio, gasolineraSeleccionada);
  
  });
  
  let comoLlegar = document.getElementById("mostrarMapaP");
  comoLlegar.onclick = function(){
    mapaComoLLegar(gasolinerasRadio, gasolineraSeleccionada)
  
    document.getElementById("map").style.display = "none";
    document.getElementById("map4").style.display = "block";
  }


}


//FUNCIONALIDAD GASOLINERA MAS CERCANA

if (document.title == "GASOLINE HACK - Tu gasolinera mas cercana") {

  getUserUbication()
  getGasolineras().then(() => {
    depurar1();
    depurar2();
    getGasolineraMasCercana(gasolinerasDepurado2);
    ordenarPorDistancia();
    pintarTarjetaGasolinera(gasolinerasDepurado2[0])
    mapa1(gasolinerasDepurado2, 0)
  });

  let comoLlegar = document.getElementById("mostrarMapaP");
  comoLlegar.onclick = function(){
    mapaComoLLegar(gasolinerasDepurado2, 0)
  
    document.getElementById("map").style.display = "none";
    document.getElementById("map4").style.display = "block";
  } 
};