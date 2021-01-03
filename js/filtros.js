// Variables
const companyId = document.querySelector('#compania');
const userId = document.querySelector('#usuario');
const initialDate = document.querySelector('#fecha-inicio');
const lastDate = document.querySelector('#fecha-final');
const intervaloMinutos = document.querySelector('#intervalo');

cargarEventsListeners();

function cargarEventsListeners() {
    companyId.addEventListener('blur', filtrarCompania);
    userId.addEventListener('blur', filtrarUsuario);
    initialDate.addEventListener('blur', filtrarFechas);
    lastDate.addEventListener('blur', filtrarFechas);
    intervaloMinutos.addEventListener('blur', filtrarIntervalo);
}

function filtrarCompania(evt) {
    console.log(evt.target);
}

function filtrarUsuario(evt) {
    console.log(evt.target);
}

function filtrarFechas(evt) {
    console.log(evt.target);
}

function filtrarIntervalo(evt) {
    console.log(evt.target);
}