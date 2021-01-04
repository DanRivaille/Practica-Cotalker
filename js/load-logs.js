// Elementos HTML
const cargarLogsBtn = document.querySelector('#contenedor-archivo button');
const inputFileLogs = document.querySelector('#contenedor-archivo input');
const inputFechaInicial = document.querySelector('#fecha-inicio');
const inputFechaFinal = document.querySelector('#fecha-final');
const reader = new FileReader();

// Guardara los registros de los logs
const registros = [];

cargarEventsListeners();

/**
 * Funcion que carga los events listeners
 * */
function cargarEventsListeners() {
    cargarLogsBtn.addEventListener('click', cargarLogs);
    inputFileLogs.addEventListener('change', handleSelect);
    reader.addEventListener('loadend', habilitarBotonCargarLogs)
}

/**
 * Funcion que habilitara el boton de cargar los logs, luego de que se termine de subir el archivo
 * */
function habilitarBotonCargarLogs() {
    console.log('Archivo cargado exitosamente');
    cargarLogsBtn.removeAttribute('disabled');
}

/**
 * Funcion que se ejecuta cuando se selecciona otro archivo, y desabilita el boton de cargar logs,
 * que luego sera activado de nuevo cuando se termine de cargar el archivo
 * */
function handleSelect(e) {
    cargarLogsBtn.setAttribute('disabled', true);
    const file = inputFileLogs.files[0];
    reader.readAsDataURL(file);
}

/**
 * Funcion que carga los logs del archivo seleccionado y pobla el vector 'registros',
 * y establece los rango permitidos a eligir por el usuario en el input de las fechas
 * */
function cargarLogs() {
    if(inputFileLogs.files.length > 0) {
        // Se reinicializa el vector de registros para guardar los nuevos
        registros.length = 0;

        Papa.parse(inputFileLogs.files[0], {
            worker: true,
            step: function(resultado) {
                if(resultado.data.length > 1) {
                    const nuevoRegistro = crearRegistro(resultado.data);
                    registros.push(nuevoRegistro);
                }
            },
            complete: function() {
                establecerRangoFechas();
                console.log('logs cargados');
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

/**
 * Funcion que establece el rango permitido de fecha a elegir, dependiendo de los rangos
 * reales de los logs ingresados
 * */
function establecerRangoFechas() {
    const maxFecha = new Date(registros[registros.length - 1].dateMs);
    const minFecha = new Date(registros[0].dateMs);

    // Se obtiene las fechas en el formato YYYY-MM-DD
    const maxFechaFormateada = obtenerFechaFormatoYMD(maxFecha);
    const minFechaFormateada = obtenerFechaFormatoYMD(minFecha);

    inputFechaInicial.setAttribute('min', minFechaFormateada);
    inputFechaInicial.setAttribute('max', maxFechaFormateada);

    inputFechaFinal.setAttribute('min', minFechaFormateada);
    inputFechaFinal.setAttribute('max', maxFechaFormateada);
}

/**
 * Funcion que transforma el objeto Date ingresado en el formato YYYY-MM-DD
 * */
function obtenerFechaFormatoYMD(fechaFormatoDate) {
    const year = fechaFormatoDate.getFullYear();
    const month = ('0' + (fechaFormatoDate.getMonth() + 1)).slice(-2);
    const day = ('0' + (fechaFormatoDate.getDate() + 1)).slice(-2);

    const resultado = `${year}-${month}-${day}`;
    return resultado;
}