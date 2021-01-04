const CANT_INTERVALOS = 5;          // Indica cuantos intervalos se van a considerar al calcular las sesiones
const intervalos = [];

/**
 * Funcion que genera los intervalos que se mostraran en el grafico
 * */
function generarIntervalosTiempo(fechaInicialMs, fechaFinalMs) {
    intervalos.length = 0;

    const longitud_intervalo = Math.trunc((fechaFinalMs - fechaInicialMs) / CANT_INTERVALOS);

    for(let i = 0; i <= CANT_INTERVALOS; ++i) {
        intervalos.push(fechaInicialMs + (longitud_intervalo * i));
    }
}

/**
 * Funcion que actualiza el intervalo de fechas que se mostrara en el grafico
 * */
function actualizarIntervalosFechas(fechaInicialMs, fechaFinalMs) {
    if(-1 == fechaInicialMs)
        fechaInicialMs = registros[0].dateMs;

    if(-1 == fechaFinalMs)
        fechaFinalMs = registros[registros.length - 1].dateMs;

    generarIntervalosTiempo(fechaInicialMs, fechaFinalMs);
    labelsChart.length = 0;

    intervalos.forEach(dateMs => {
        const date = new Date(dateMs);
        labelsChart.push(obtenerFechaFormatoYMD(date));
    })
}

/*TEMPORAL*/
const crearGraficoBtn = document.querySelector('#crear-grafico');

crearGraficoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    actualizarIntervalosFechas(filtros.initialDateMs, filtros.lastDateMs);
    const ses = obtenerSesionesPorUsuario(15);
    const can = obtenerCantidadSesiones(ses);

    intervalos.splice(0, 1);

    labelsChart = intervalos;
    datasetsChart.push({data: can});

    renderChart();

    console.log(can);
})

function obtenerCantidadSesiones(sesionesPorUsuario) {
    const cantidades = [];

    for(let i = 1; i < intervalos.length; ++i) {
        cantidades.push(0);

        sesionesPorUsuario.forEach((usuario) => {
            usuario.sesiones.forEach(s => {
                if(perteneceIntervalo(intervalos[i - 1], intervalos[i], s)) {
                    cantidades[i - 1]++;
                }
            })
        });
    }

    return cantidades;
}

function perteneceIntervalo(limiteInferior, limiteSuperior, sesion) {
    if((limiteInferior <= sesion.inicio) && (sesion.inicio <= limiteSuperior))
        return true;

    if((limiteInferior <= sesion.final) && (sesion.final <= limiteSuperior))
        return true;

    return false;
}

function obtenerSesionesPorUsuario(intervaloMinutos) {
    const sesionesPorUsuario = new Map();
    const intervaloMs = intervaloMinutos * 60000;

    registros.forEach(reg => {
        const clave = obtenerClave(reg);

        if(sesionesPorUsuario.has(clave)) {
            const usuario = sesionesPorUsuario.get(clave);
            
            if((reg.dateMs - usuario.temp.actual) > intervaloMs) {
                const nuevaSesion = {inicio: usuario.temp.inicio, final: usuario.temp.actual};
                
                usuario.sesiones.push(nuevaSesion);
                usuario.temp.inicio = reg.dateMs;
                usuario.temp.actual = reg.dateMs;
            } else {
                usuario.temp.actual = reg.dateMs;
            }
        } else {
            const nuevoUsuario = {sesiones: [], 
                temp: {
                    inicio: reg.dateMs, 
                    actual: reg.dateMs
                }
            };
            sesionesPorUsuario.set(clave, nuevoUsuario);
        }
    });

    const sesiones = [];

    sesionesPorUsuario.forEach((usuario, clave, mapa) => {
        if((usuario.temp.actual - usuario.temp.inicio) >= intervaloMs) {
            const nuevaSesion = {inicio: usuario.temp.inicio, final: usuario.temp.actual};
            usuario.sesiones.push()
        }

        if(usuario.sesiones.length > 0) {
            sesiones.push(usuario);
        }
    })

    return sesiones;
}

function obtenerClave(reg) {
    return `${reg.companyId}-${reg.userId}`
}