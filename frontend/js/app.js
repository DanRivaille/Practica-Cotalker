// Variables
const fechaInicialInput = document.querySelector('#fecha-inicial');
const fechaFinalInput = document.querySelector('#fecha-final');

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

/*TEMPORAL*/
const crearGraficoBtn = document.querySelector('#crear-grafico');

crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    console.log(filtros);

    axios.post('http://localhost:3000/api/logs', filtros)
    .then(response => {
        datasetsChart.push({data: response.data.datasets});

        labelsChart = response.data.labels.map(l => {
            const d = new Date(l);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        });

        console.log(datasetsChart, labelsChart);
        renderChart();
    })
})

/**
 * Funcion que establece los valores limites de los elementos input HTML para que solo se puedan
 * elegir fechas dentro del rango permitido por logs
 * */
function establecerLimitesFechas(fechaInput, fechaInicial, fechaFinal) {
    fechaInput.setAttribute('min', fechaInicial);
    fechaInput.setAttribute('max', fechaFinal);
}