// Variables
const companyIdInput = document.querySelector('#compania');
const userIdInput = document.querySelector('#usuario');
const initialDateInput = document.querySelector('#fecha-inicio');
const lastDateInput = document.querySelector('#fecha-final');
const intervaloInput = document.querySelector('#intervalo');

// Objeto que guarda los filtros actuales
const filtros = {
    companyId: -1,
    userId: -1,
    initialDateMs: -1,
    lastDateMs: -1,
    intervaloMinutos: 15
}

cargarEventsListeners();

/**
 * Funcion que carga los events listeners de los elementos del formulario
 * */
function cargarEventsListeners() {
    companyIdInput.addEventListener('blur', filtrarCompania);
    userIdInput.addEventListener('blur', filtrarUsuario);
    initialDateInput.addEventListener('change', filtrarFechas);
    lastDateInput.addEventListener('change', filtrarFechas);
    intervaloInput.addEventListener('blur', filtrarIntervalo);
}

/** Funcion que actualiza el filtro del id de la compañia */
function filtrarCompania(evt) {
    filtros.companyId = (evt.target.value == '') ? -1 : parseInt(evt.target.value);
}

/** Funcion que actualiza el filtro del id de usuario */
function filtrarUsuario(evt) {
    filtros.userId = (evt.target.value == '') ? -1 : parseInt(evt.target.value);
}

/** Funcion que actualiza el filtro las fechas correspondientes */
function filtrarFechas(evt) {
    if(evt.target.getAttribute('id') == 'fecha-inicio') {
        filtros.initialDateMs = (evt.target.value == '') ? -1 : Date.parse(evt.target.value);
    } else {
        filtros.lastDateMs = (evt.target.value == '') ? -1 : Date.parse(evt.target.value);
    }

    actualizarIntervalosFechas(filtros.initialDateMs, filtros.lastDateMs);
    renderChart();
}

/** Funcion que actualiza el filtro intervalo */
function filtrarIntervalo(evt) {
    filtros.intervaloMinutos = (evt.target.value == '') ? 15 : parseInt(evt.target.value);
}