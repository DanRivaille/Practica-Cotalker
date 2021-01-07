
document.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/api/logs')
    .then(response => {
        console.log(response);
    })

});

/*TEMPORAL*/
const crearGraficoBtn = document.querySelector('#crear-grafico');

crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
})