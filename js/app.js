const CANT_INTERVALOS = 5;          // Indica cuantos intervalos se van a considerar al calcular las sesiones
const intervalos = [];

/**
 * Funcion que genera los intervalos que se mostraran en el grafico
 * */
function generarIntervalosTiempo(fechaInicialMs, fechaFinalMs) {
    intervalos.length = 0;

    const longitud_intervalo = Math.trunc((fechaFinalMs - fechaInicialMs) / CANT_INTERVALOS);

    for(let i = 0; i <= CANT_INTERVALOS; ++i) {
        intervalos.push(fechaInicialMs + (longitud_intervalo * i));
    }
}

/**
 * Funcion que actualiza el intervalo de fechas que se mostrara en el grafico
 * */
function actualizarIntervalosFechas(fechaInicialMs, fechaFinalMs) {
    if(-1 == fechaInicialMs)
        fechaInicialMs = registros[0].dateMs;

    if(-1 == fechaFinalMs)
        fechaFinalMs = registros[registros.length - 1].dateMs;

    generarIntervalosTiempo(fechaInicialMs, fechaFinalMs);
    labelsChart.length = 0;

    intervalos.forEach(dateMs => {
        const date = new Date(dateMs);
        labelsChart.push(obtenerFechaFormatoYMD(date));
    })
}

/*TEMPORAL*/
const crearGraficoBtn = document.querySelector('#crear-grafico');

crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    actualizarIntervalosFechas(filtros.initialDateMs, filtros.lastDateMs);

    console.log('generar')
    renderChart();
})