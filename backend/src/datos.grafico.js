const CANT_INTERVALOS = 5;

/**
 * Funcion que recibe los registros obtenidos de la consulta a la DB, y obtiene
 * los labels del grafico, estos labels seran las fechas que se dibujaran en el 
 * eje horizontal del grafico
 * */
function obtenerIntervalos(fechaInicialMs, fechaFinalMs) {
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
function obtenerDatasets(usuarios, intervaloMs, intervalos) {
    const sesiones = obtenerSesiones(usuarios, intervaloMs);
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

function obtenerSesiones(usuarios, intervaloMs) {
    let sesiones = [];

    usuarios.forEach(usuario => {
        if(usuario.temp.actual != usuario.temp.inicio) {
            if((usuario.temp.actual - usuario.temp.inicio) <= intervaloMs) {
                const nuevaSesion = {"inicio": usuario.temp.inicio, "final": usuario.temp.actual};
                usuario.sesiones.push(nuevaSesion);
            }

        }

        if(usuario.sesiones.length > 0) {
            sesiones = sesiones.concat(usuario.sesiones);
        }
    });

    return sesiones;
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

function procesarRegistros(reg, usuarios, intervaloMs) {
    const clave = obtenerClave(reg);
    const fechaActual = Date.parse(reg.date);

    if(usuarios.has(clave)) {
        const usuario = usuarios.get(clave);

        if((fechaActual - usuario.temp.actual) >= intervaloMs) {
            if(usuario.temp.actual != usuario.temp.inicio) {
                const nuevaSesion = {"inicio": usuario.temp.inicio, "final": usuario.temp.actual};
                usuario.sesiones.push(nuevaSesion);
            }

            usuario.temp.inicio = fechaActual;
        }

        usuario.temp.actual = fechaActual;
    } else {
        const nuevoUsuario = {"sesiones": [], "temp": {"inicio": fechaActual, "actual": fechaActual}};
        usuarios.set(clave, nuevoUsuario);
    }
}


module.exports = {obtenerDatasets, obtenerIntervalos, procesarRegistros};