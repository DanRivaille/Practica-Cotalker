// Contexto del canvas en donde se dibujara el grafico
const ctx = document.querySelector('#my-chart').getContext('2d');

// Datos del grafico
const dataChart = {
    labels: [1, 2, 3, 4],
    datasets: [
        {
            data: [10, 20, 30, 40],
            fill: false
        }
    ]
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