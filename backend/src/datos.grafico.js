/**
 * @fileoverview Contiene las funciones que procesaran los datos de la BD para generar el grafico
 * 
 * @author Dan Santos
 * @version 1.0
 * */

 // Variables
const CANT_INTERVALOS = 5;      // Cantidad de intervalos que se dibujaran en el grafico (eje x)

function Sesion(inicio, final) {
    this.inicio = inicio;
    this.final = final;
}

function Usuario(fechaActual) {
    this.sesiones = [];
    this.temp = {
        inicio: fechaActual,
        actual:fechaActual
    };
}

/**
 * Funcion que se ejecutara en cada registro obtenido de la DB, y lo procesara para obtener cada usuario por separado
 * con sus sesiones.
 * @param {Object} reg registro obtenido de la DB
 * @param {Map} usuarios mapa que contiene los usuarios y sus sesiones (key:"compayId-userId", value: Object Usuario)
 * @param {bigint} intervaloMs intervalo en donde se considera una sesion activa representado en milisegundos
 * */
function procesarRegistros(reg, usuarios, intervaloMs) {
    const clave = obtenerClave(reg);
    const fechaActual = Date.parse(reg.date);

    if(usuarios.has(clave)) {
        const usuario = usuarios.get(clave);

        if((fechaActual - usuario.temp.actual) >= intervaloMs) {
            if(usuario.temp.actual != usuario.temp.inicio) {
                const nuevaSesion = new Sesion(usuario.temp.inicio, usuario.temp.actual);
                usuario.sesiones.push(nuevaSesion);
            }

            usuario.temp.inicio = fechaActual;
        }

        usuario.temp.actual = fechaActual;
    } else {
        const nuevoUsuario = new Usuario(fechaActual);
        usuarios.set(clave, nuevoUsuario);
    }
}

/**
 * @param {BigInteger} fechaInicialMs Fecha inicial de los logs en milisegundos
 * @param {BigInteger} fechaFinalMs Fecha final de los logs en milisegundos
 * @returns {Int32Array} Intervalos que se dibujaran en el grafico, y sobre el cual se calcularan las
 * cantidades de sesiones activas.
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
 * Funcion que recibe los usuarios preprocesados y obtiene los datasets que poblaran el grafico
 * @param {Map} usuarios mapa que contiene los usuarios y sus sesiones (key:"compayId-userId", value: Object Usuario)
 * @param {bigint} intervaloMs intervalo en donde se considera una sesion activa representado en milisegundos
 * @param {Int32Array} intervalos sobre el cual se calcularan las cantidades de sesiones activas.
 * @returns {Int32Array} cantidad de sesiones activas encontradas en cada intervalo
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

/**
 * A partir del mapa de usuarios, se obtienen solo las sesiones
 * @param {Map} usuarios mapa que contiene los usuarios y sus sesiones (key:"compayId-userId", value: Object Usuario)
 * @param {bigint} intervaloMs intervalo en donde se considera una sesion activa representado en milisegundos
 * @returns {Array} vector que guarda todas las sesiones activas
 * */
function obtenerSesiones(usuarios, intervaloMs) {
    let sesiones = [];

    usuarios.forEach(usuario => {
        // Se comprueba quedo pendiente una sesion de algun usuario para agregarse a su lista de sesiones
        if(usuario.temp.actual != usuario.temp.inicio) {
            if((usuario.temp.actual - usuario.temp.inicio) <= intervaloMs) {
                const nuevaSesion = new Sesion(usuario.temp.inicio, usuario.temp.actual);
                usuario.sesiones.push(nuevaSesion);
            }

        }

        if(usuario.sesiones.length > 0) {
            sesiones = sesiones.concat(usuario.sesiones);
        }
    });

    return sesiones;
}

/**
 * Obtiene una clave que se usara en el Map
 * @param {Object} reg registro obtenido de la DB
 * @returns {string} clave generada a partir del registro
 * */
function obtenerClave(reg) {
    return `${reg.companyId}-${reg.userId}`;
}

/**
 * Comprueba si la sesion ingresada esta dentro del intervalo [limInf, limSup]
 * @param {bigint} limInf limite ingerior del intervalo
 * @param {bigint} limSup limite superior del intervalo
 * @param {Object} sesion objeto que se verificara si esta dentro del intervalo o no
 * @returns {boolean} True si esta dentro, false en caso contrario
 * */
function perteneceIntervalo(limInf, limSup, sesion) {
    if((limInf <= sesion.inicio) && (sesion.inicio <= limSup))
        return true;

    if((limInf <= sesion.final) && (sesion.final <= limSup))
        return true;

    return false;
}


// Se exportan las funciones que procesaran los datos para generar el grafico
module.exports = {obtenerDatasets, obtenerIntervalos, procesarRegistros};