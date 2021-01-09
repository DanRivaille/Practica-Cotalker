const CANT_INTERVALOS = 5;

/**
 * Funcion que recibe los registros obtenidos de la consulta a la DB, y obtiene
 * los labels del grafico, estos labels seran las fechas que se dibujaran en el 
 * eje horizontal del grafico
 * */
function obtenerLabels(fechaInicialMs, fechaFinalMs) {
    const longitudIntervalos = Math.trunc((fechaFinalMs - fechaInicialMs) / CANT_INTERVALOS);

    const intervalos = [];

    for(let i = 0; i <= CANT_INTERVALOS; ++i) {
        intervalos.push(fechaInicialMs + (i * longitudIntervalos));
    }

    return intervalos;
}

/**
 * Funcion que recibe los registros obtenidos de la consulta a la DB, y obtiene 
 * los datasets que poblaran el grafico
 * */
function obtenerDatasets(sesiones, intervalos) {
    const cantidades = [];

    for(let i = 1; i < intervalos.length; ++i) {
        cantidades.push(0);

        sesiones.forEach(s => {
            if(perteneceIntervalo(intervalos[i - 1], intervalos[i], s)) {
                cantidades[i - 1]++;
            }
        })
    }

    return cantidades;
}

function obtenerClave(reg) {
    return `${reg.companyId}-${reg.userId}`;
}

function perteneceIntervalo(limInf, limSup, sesion) {
    if((limInf <= sesion.inicio) && (sesion.inicio <= limSup))
        return true;

    if((limInf <= sesion.final) && (sesion.final <= limSup))
        return true;

    return false;
}

module.exports = {obtenerLabels, obtenerDatasets, obtenerClave};