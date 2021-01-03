const cargarLogsBtn = document.querySelector('#contenedor-archivo button');
const inputFileLogs = document.querySelector('#contenedor-archivo input');

// Guardara los registros de los logs
const registros = [];

cargarLogsBtn.addEventListener('click', cargarLogs);

/**
 * Funcion que carga los logs del archivo seleccionado y pobla el vector 'registros'
 * */
function cargarLogs() {
    if(inputFileLogs.files.length > 0) {
        Papa.parse(inputFileLogs.files[0], {
            worker: true,
            step: function(resultado) {
                if(resultado.data.length > 1) {
                    const nuevoRegistro = crearRegistro(resultado.data);
                    registros.push(nuevoRegistro);
                }
            }
        });
    } else {
        console.log('No selecciono ningun archivo');
    }
}

/**
 * Funcion que recibe la lista de datos del log actual y retorna un objeto de registro
 */
function crearRegistro(log) {
    const nuevoRegistro = {
        'companyId': log[0],
        'userId': log[1],
        'methodApi': log[2],
        'timeMs': log[3],
        'dateMs': Date.parse(log[4]),
        'source': log[5]
    }

    return nuevoRegistro;
}