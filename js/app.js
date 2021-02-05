const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const container = document.querySelector(".container");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  }

  consultarAPI(ciudad, pais);
}

function imprimirAlerta(mensaje, tipo) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    const divMensaje = document.createElement("div");

    divMensaje.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    divMensaje.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
  `;

    container.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  const appId = "eeea7e5e89719be5cde7960bc4b9069b";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},{state code},${pais}&appid=${appId}`;

  Spinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHTML();

      if (datos.cod === "404") {
        imprimirAlerta("Ciudad no encontrada", "error");
        return;
      }

      mostrarClima(datos);
    });
}

function mostrarClima(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;
  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add("font-bold", "text-2xl");

  const actual = document.createElement("p");
  actual.innerHTML = `${centigrados} &#8451`;
  actual.classList.add("font-bold", "text-6xl");

  const maxima = document.createElement("p");
  maxima.innerHTML = `Max: ${max} &#8451`;
  maxima.classList.add("text-xl");

  const minima = document.createElement("p");
  minima.innerHTML = `Min: ${min} &#8451`;
  minima.classList.add("text-xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(maxima);
  resultadoDiv.appendChild(minima);

  resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHTML();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");

  divSpinner.innerHTML = `
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
	`;

  resultado.appendChild(divSpinner);
}
