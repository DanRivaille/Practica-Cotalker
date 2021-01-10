/**
 * @fileoverview Contiene las funciones que manejan los eventos para actualizar los valores del
 * filtro del formulario HTML
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Variables
const companyIdInput = document.querySelector('#compania');
const userIdInput = document.querySelector('#usuario');
const initialDateInput = document.querySelector('#fecha-inicial');
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
    const valorInput = evt.target.value;

    if(evt.target.getAttribute('id') == 'fecha-inicial') {
        const fecha = (valorInput == '') ? rangoFechasValidas.fechaInicial : valorInput;
        filtros.initialDateMs = Date.parse(fecha);
    } else {
        const fecha = (valorInput == '') ? rangoFechasValidas.fechaFinal : valorInput;
        filtros.lastDateMs = Date.parse(fecha);
    }

}

/** Funcion que actualiza el filtro intervalo */
function filtrarIntervalo(evt) {
    filtros.intervaloMinutos = parseInt(evt.target.value);
}