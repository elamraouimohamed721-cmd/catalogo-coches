const lista = document.getElementById("lista");
const buscador = document.getElementById("buscador");
const epoca = document.getElementById("epoca");

function dentroDeEpoca(anio, valor) {
 if (valor === "todas") return true;
 const inicio = parseInt(valor);
 const fin = inicio === 2000 ? 9999 : (inicio === 1880 ? 1919 : inicio + 39);
 return anio >= inicio && anio <= fin;
}

function mostrar() {
 const texto = buscador.value.toLowerCase();
 lista.innerHTML = "";
 coches
 .filter(c => (c.marca + " " + c.modelo).toLowerCase().includes(texto))
 .filter(c => dentroDeEpoca(c.anio, epoca.value))
 .sort((a, b) => a.anio - b.anio)
 .forEach(c => {
 lista.innerHTML += `<div class="coche"><h2>${c.marca} ${c.modelo}</h2><p class="anio">${c.anio} · ${c.pais}</p><p>💰 Precio original: ${c.precioOriginal}</p><p>📈 Precio hoy: ${c.precioActual}</p><p>📖 ${c.dato}</p></div>`;
 });
}

buscador.addEventListener("input", mostrar);
epoca.addEventListener("change", mostrar);
mostrar();
