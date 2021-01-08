// Variables
const fechaInicialInput = document.querySelector('#fecha-inicial');
const fechaFinalInput = document.querySelector('#fecha-final');


/**
 * Funcion que se ejecuta cuando se termina de cargar el DOM, realiza una peticion con el metodo GET
 * a la API del servidor, la cual retorna las fechas inicial y final de los logs registrados
 * */
document.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/api/logs')
    .then(response => {
        const fechaInicialFormateada = response.data.fechaInicial.split('T')[0];
        const fechaFinalFormateada = response.data.fechaFinal.split('T')[0];

        establecerLimitesFechas(fechaInicialInput, fechaInicialFormateada, fechaFinalFormateada);
        establecerLimitesFechas(fechaFinalInput, fechaInicialFormateada, fechaFinalFormateada);
    })

});

/*TEMPORAL*/
const crearGraficoBtn = document.querySelector('#crear-grafico');

crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
})

/**
 * Funcion que establece los valores limites de los elementos input HTML para que solo se puedan
 * elegir fechas dentro del rango permitido por logs
 * */
function establecerLimitesFechas(fechaInput, fechaInicial, fechaFinal) {
    fechaInput.setAttribute('min', fechaInicial);
    fechaInput.setAttribute('max', fechaFinal);
}