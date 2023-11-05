//VARIABLES
let gasolinerasBruto;
let gasolinerasDepurado1 = [];
let gasolinerasDepurado2 = [];
let latitudUser;
let longitudUser;
let ordenarDistancia = [];
let buscarProvincia = document.getElementById("eleccionUsuario");
let provinciaElegida;
let combustibleElegido;
let gasolinerasProvincia = [];

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
function ordenarPorPrecio() {
  gasolinerasProvincia.sort(function (a, b) {
    if (a["Precio Gasolina 95 E5"] > b["Precio Gasolina 95 E5"]) {
      return 1;
    }
    if (a["Precio Gasolina 95 E5"] < b["Precio Gasolina 95 E5"]) {
      return -1;
    }

    return 0;
  });
};

// template para pintar en DOM lista de GASOLINERAS PROVINCIA:
function pintarTabla() {

  const tbody = document.querySelector("table.tabla-gasolineras tbody");

  gasolinerasProvincia.slice(0, 10).forEach((gasolinera) => {
    const tr = document.createElement("tr");

    tr.innerHTML =
      `<td>${gasolinera.Localidad}</td>
    <td>${gasolinera.Dirección}</td>
    <td>${gasolinera.Rótulo}</td>
    <td>${gasolinera["Precio Gasolina 95 E5"]}</td>
    <td>${gasolinera["Precio Gasoleo A"]}</td>
    <td><a href="https://www.google.com/maps/search/?api=1&query=${gasolinera.direccion}">Ver en mapa</a></td>`;

    tbody.appendChild(tr);
  });


}

//OBTENER UBICACION DEL USUARIO 

function getUserUbication() {
  navigator.geolocation.getCurrentPosition((position) => {
    // Almacenamos la latitud y longitud en las variables declaradas
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
  ordenarDistancia.push(R * c);
  return R * c;
}

//APLICAR HAVERSIN AL OBJETO DEVUELTO POR LA API YA FILTRADO
function getGasolineraMasCercana() {
  for (let i = 0; i<gasolinerasDepurado2.length; i++){
   distanciaHaversine(latitudUser, longitudUser, gasolinerasDepurado2[i].Latitud,gasolinerasDepurado2[i]["Longitud (WGS84)"])
  }
  
  //OBTENER INDICE EN EL ARRAY CON LA MENOR DISTANCIA
  function findMinIndex(array) {
    let minIndex = 0;
    let minValue = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] < minValue) {
        minValue = array[i];
        minIndex = i;
      }
    }
    console.log(minIndex)
    pintarCercana = minIndex;
  }

  findMinIndex(ordenarDistancia)

}



// template para pintar en el DOM los parámetros de la GASOLINERA MAS CERCANA;







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
    ordenarPorPrecio();
    pintarTabla();
  });
  

}










// if (document.title == "GASOLINE HACK - Gasolineras mas baratas de tu provincia") {

// }









//   



//   //SELECCIONAR PROVINCIA ELEGIDA POR EL USUARIO
//   let gasolinerasProvincia = [];




//FUNCIONALIDADES BUSQUEDA RADIO
if (document.title == "GASOLINE HACK - Gasolineras mas baratas cerca de tu ubicación") {
  
  getUserUbication()

  const distancia = document.querySelector("#distancia");
  const radioBusqueda = document.querySelector(".radioBusqueda");

  radioBusqueda.textContent = distancia.value;

  distancia.addEventListener("input", function () {
    radioBusqueda.textContent = distancia.value;
  });


}


//FUNCIONALIDAD GASOLINERA MAS CERCANA

if (document.title == "GASOLINE HACK - Tu gasolinera mas cercana"){
  
  getUserUbication()
  getGasolineras().then(() => {
    depurar1();
    depurar2();
    getGasolineraMasCercana()
  });



}









//  ********* FUNCIONES ***************

//LLAMADA FECTH










//ELIMINAR DEL OBJETO GASOLINERAS SIN VENTA AL PUBLICO (SOLO PARA COOPERATIVISTAS Y SOCIOS);
// let gasolinerasDepurado1 = [];
// for (let i = 0; i < gasolinerasBruto.length; i++) {
//   if (gasolinerasBruto[i]["Tipo venta"] == "P"){

//     gasolinerasDepurado1.push(gasolinerasBruto[i]);

//   }
// }

// //Obtener datos provincia
// let gasolinerasProvincia = [];
// for (let i = 0; i < gasolinerasBruto.length; i++) {
//   if (gasolinerasDepurado1[i].Provincia == "MADRID"){

//     gasolinerasProvincia.push(gasolinerasDepurado1[i]);

//   }
// }



//ordenar por cumbustible


//Obtener datos provincia
// let gasolinerasMadrid = [];
// for (let i = 0; i < gasolinerasBruto.length; i++) {
//   if (gasolinerasBruto[i].Provincia == "MADRID"){

//     gasolinerasMadrid.push(gasolinerasBruto[i]);

//   }
// }
// //ordenar por cumbustible
// gasolinerasMadrid.sort(function (a, b) {
//   if (a["Precio Gasoleo A"] > b["Precio Gasoleo A"]) {
//     return 1;
//   }
//   if (a["Precio Gasoleo A"] < b["Precio Gasoleo A"]) {
//     return -1;
//   }

//   return 0;
// });

// // ordenar por marca
// gasolinerasMadrid.sort(function (a, b) {
//   if (a["Rótulo"] > b["Rótulo"]) {
//     return 1;
//   }
//   if (a["Rótulo"] < b["Rótulo"]) {
//     return -1;
//   }

//   return 0;
// });*/