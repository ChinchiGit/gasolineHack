//VARIABLES


//FUNCIONALIDADES BOTONES IDEX
if (document.title == "GASOLINE HACK - Home"){
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


//FUNCIONALIDADES BUSQUEDA RADIO
if (document.title == "GASOLINE HACK - Gasolineras mas baratas cerca de tu ubicación") {
  const distancia = document.querySelector("#distancia");
  const radioBusqueda = document.querySelector(".radioBusqueda");

  radioBusqueda.textContent = distancia.value;

  distancia.addEventListener("input", function () {
    radioBusqueda.textContent = distancia.value;
  });


}







/*

// llamada fetch
let gasolinerasBruto;

function getGasolineras () {
    return fetch('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/')
        .then(res=>res.json())
        .then(gasolineras=> {
            gasolinerasBruto = gasolineras.ListaEESSPrecio;
            return gasolineras.ListaEESSPrecio
        })
}

getGasolineras ()

// FILTRADO para eliminar gasolineras que no venden diesel, solo GLP
x = gasolinerasBruto.filter(gasolinera => gasolinera["Provincia"] == "Madrid" );

//Obtener datos provincia
let gasolinerasMadrid = [];
for (let i = 0; i < gasolinerasBruto.length; i++) {
  if (gasolinerasBruto[i].Provincia == "MADRID"){
    gasolinerasMadrid.push(gasolinerasBruto[i]);
  }
} 
//ordenar por cumbustible
gasolinerasMadrid.sort(function (a, b) {
  if (a["Precio Gasoleo A"] > b["Precio Gasoleo A"]) {
    return 1;
  }
  if (a["Precio Gasoleo A"] < b["Precio Gasoleo A"]) {
    return -1;
  }

  return 0;
});

// ordenar por marca
gasolinerasMadrid.sort(function (a, b) {
  if (a["Rótulo"] > b["Rótulo"]) {
    return 1;
  }
  if (a["Rótulo"] < b["Rótulo"]) {
    return -1;
  }

  return 0;
});


// template para pintar en DOM lista de GASOLINERAS PROVINCIA:
const tbody = document.querySelector("table.tabla-gasolineras tbody");

gasolineras.slice(0, 10).forEach((gasolinera) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${gasolinera.localidad}</td>
    <td>${gasolinera.direccion}</td>
    <td>${gasolinera.marca}</td>
    <td>${gasolinera.precios.gasoleo95}</td>
    <td>${gasolinera.precios.gasoleoA}</td>
    <td><a href="https://www.google.com/maps/search/?api=1&query=${gasolinera.direccion}">Ver en mapa</a></td>
  `;

  tbody.appendChild(tr);
});


*/