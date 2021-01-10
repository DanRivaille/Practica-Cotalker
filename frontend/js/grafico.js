/**
 * @fileoverview Contiene todos los datos y opciones relacionados con el grafico, para cambiar los datasets
 * se modifica dataChart.datasets, y para cambiar los labels del grafico, se modifica dataChart.labels
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Contexto del canvas en donde se dibujara el grafico
const ctx = document.querySelector('#my-chart').getContext('2d');

// Datos del grafico
const dataChart = {
    labels: [],
    datasets: []
};

// Opciones del grafico
const optionsChart = {
    responsive: false
};

renderChart();

/**
 * Funcion que redibuja el grafico en el canvas con los datos y opciones correspondientes
 * */
function renderChart() {
    const chart = new Chart(ctx, {
        type: 'line',
        data: dataChart,
        options: optionsChart
    });
}