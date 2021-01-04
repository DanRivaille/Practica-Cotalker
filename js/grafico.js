// Contexto del canvas en donde se dibujara el grafico
const ctx = document.querySelector('#my-chart').getContext('2d');

const datasetsChart = [];

const labelsChart = [];

// Datos del grafico
const dataChart = {
    labels: labelsChart,
    datasets: datasetsChart
};

// Opciones del grafico
const optionsChart = {
    responsive: false
};

renderChart();

function renderChart() {
    const chart = new Chart(ctx, {
        type: 'line',
        data: dataChart,
        options: optionsChart
    })
}