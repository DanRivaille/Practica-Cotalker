/**
 * @fileoverview Contiene las funciones que realizan las operaciones principales de la aplicacion,
 * que es la de la comunicacion con la api para generar el grafico.
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Variables
const fechaInicialInput = document.querySelector('#fecha-inicial');
const fechaFinalInput = document.querySelector('#fecha-final');
const crearGraficoBtn = document.querySelector('#crear-grafico');

const rangoFechasValidas = {};

/**
 * Funcion que se ejecuta cuando se termina de cargar el DOM, realiza una peticion con el metodo GET
 * a la API del servidor, la cual retorna las fechas inicial y final de los logs registrados.
 * Estas fechas son almacenadas para tener un registro de las fechas minimas y maximas posibles.
 * */
document.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/api/logs')
    .then(response => {
        const fechaInicialFormateada = response.data.fechaInicial.split('T')[0];
        const fechaFinalFormateada = response.data.fechaFinal.split('T')[0];

        establecerLimitesFechas(fechaInicialInput, fechaInicialFormateada, fechaFinalFormateada);
        establecerLimitesFechas(fechaFinalInput, fechaInicialFormateada, fechaFinalFormateada);

        rangoFechasValidas.fechaInicial = fechaInicialFormateada;
        rangoFechasValidas.fechaFinal = fechaFinalFormateada;

        filtros.initialDateMs = Date.parse(fechaInicialFormateada);
        filtros.lastDateMs = Date.parse(fechaFinalFormateada);
    })

});

/**
 * Funcion que manda una peticion POST a la api, y el envia el filtro actual y espera para que le
 * devuelva los datos del grafico obtenido, una vez obtenidos estos datos, modifica dataChart para
 * generar el nuevo grafico (vease frontend/js/grafico.js)
 * */
crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    axios.post('http://localhost:3000/api/logs', filtros)
    .then(response => {
        dataChart.datasets = [{data: response.data.datasets}];
        dataChart.labels = response.data.labels.map(l => obtenerFechaFormatoYMD(new Date(l)));

        renderChart();
    })
})

/**
 * @param {Date} fechaFormatoDate fecha que sera formateada
 * @returns {string} cadena que representa la fecha con formato YYYY-MM-DD
 * */
function obtenerFechaFormatoYMD(fechaFormatoDate) {
    const year = fechaFormatoDate.getFullYear();
    const month = ('0' + (fechaFormatoDate.getMonth() + 1)).slice(-2);
    const day = ('0' + (fechaFormatoDate.getDate())).slice(-2);

    const resultado = `${year}-${month}-${day}`;
    return resultado;
}

/**
 * Funcion que establece los valores limites de los elementos input HTML para que solo se puedan
 * elegir fechas dentro del rango permitido por logs
 * @param {HTMLInputElement} fechaInput elemento HTML que se le estableceran los atributos
 * @param {string} fechaInicial valor del atributo min
 * @param {string} fechaFinal valor del atributo max
 * */
function establecerLimitesFechas(fechaInput, fechaInicial, fechaFinal) {
    fechaInput.setAttribute('min', fechaInicial);
    fechaInput.setAttribute('max', fechaFinal);
}