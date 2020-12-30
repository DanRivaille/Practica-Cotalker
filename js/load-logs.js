registros = []

Papa.parse(document.querySelector('#archivo').files[0], {
    complete: function(results) {
        for(let i = 0; i < 10; ++i) {
            console.log(crearObj(results.data[i]));
        }

    }
})

function crearObj(registro) {
    const obj = {
        companyId: registro[0],
        userId: registro[1],
        metodoApi: registro[2],
        tiempoMs: registro[3],
        fecha: registro[4],
        source: registro[5]
    }

    return obj;
}