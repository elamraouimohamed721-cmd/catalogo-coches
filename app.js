const lista = document.getElementById("lista");
const buscador = document.getElementById("buscador");
const epoca = document.getElementById("epoca");
const modal = document.getElementById("modal");
const contenido = document.getElementById("contenido");
const cache = {};

async function datosWiki(c) {
  if (cache[c.wiki]) return cache[c.wiki];
  try {
    const r = await fetch("https://es.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(c.wiki));
    let d = r.ok ? await r.json() : null;
    if (!d || !d.thumbnail) {
      const r2 = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(c.wiki));
      if (r2.ok) { const d2 = await r2.json(); if (d2.thumbnail || !d) d = d2; }
    }
    cache[c.wiki] = d || {};
  } catch (e) { cache[c.wiki] = {}; }
  return cache[c.wiki];
}

function dentroDeEpoca(anio, valor) {
  if (valor === "todas") return true;
  const inicio = parseInt(valor);
  const fin = inicio === 2000 ? 9999 : (inicio === 1880 ? 1919 : inicio + 39);
  return anio >= inicio && anio <= fin;
}

async function abrir(c) {
  const d = await datosWiki(c);
  const foto = d.originalimage ? d.originalimage.source : (d.thumbnail ? d.thumbnail.source : "");
  contenido.innerHTML = (foto ? '<img src="' + foto + '" alt="' + c.marca + ' ' + c.modelo + '">' : '') +
    '<div class="info"><h2>' + c.marca + ' ' + c.modelo + '</h2>' +
    '<p class="anio">' + c.anio + ' · ' + c.pais + '</p>' +
    '<p>💰 Precio original: ' + c.precioOriginal + '</p>' +
    '<p>📈 Precio hoy: ' + c.precioActual + '</p>' +
    '<p>' + (d.extract || '') + '</p></div>' +
    '<button class="cerrar" onclick="cerrar()">Cerrar</button>';
  modal.style.display = "block";
}

function cerrar() { modal.style.display = "none"; }

function mostrar() {
  const texto = buscador.value.toLowerCase();
  lista.innerHTML = "";
  coches
    .filter(c => (c.marca + " " + c.modelo).toLowerCase().includes(texto))
    .filter(c => dentroDeEpoca(c.anio, epoca.value))
    .sort((a, b) => a.anio - b.anio)
    .forEach(c => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "coche";
      tarjeta.innerHTML = '<img alt="' + c.marca + ' ' + c.modelo + '"><div class="info"><h2>' + c.marca + ' ' + c.modelo + '</h2><p class="anio">' + c.anio + ' · ' + c.pais + '</p><p>💰 ' + c.precioOriginal + '</p></div>';
      tarjeta.onclick = () => abrir(c);
      lista.appendChild(tarjeta);
      datosWiki(c).then(d => {
        const img = tarjeta.querySelector("img");
        if (d.thumbnail) img.src = d.thumbnail.source;
      });
    });
}

modal.addEventListener("click", e => { if (e.target === modal) cerrar(); });
buscador.addEventListener("input", mostrar);
epoca.addEventListener("change", mostrar);
mostrar();
