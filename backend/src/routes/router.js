const Router = require('express').Router;
const router = Router();
const connect = require('../database');
const {obtenerLabels, obtenerDatasets, obtenerClave} = require('../datos.grafico');

router.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

/**
 * Se ejecuta cuando se realiza una consulta con el metodo get a la ruta /api/logs, este devuelve las fechas
 * limite validas dependiendo de los logs cargados en la DB
 * */
router.get('/logs', async (req, res) => {
    const db = await connect();
    const collection = db.collection('registros');

    const fechasLimite = {};

    // Se obtiene el primer registro, para acceder a la primera fecha
    await collection.findOne().then(primerRegistro => {
        fechasLimite.fechaInicial = primerRegistro.date
    });

    // Se obtiene el ultimo registro para acceder a la ultima fecha
    await collection.find().sort({"date": -1}).limit(1)
    .toArray()
    .then(ultimoRegistro => {
        fechasLimite.fechaFinal = ultimoRegistro[0].date;
    });

    res.json(fechasLimite);
});

/**
 * Se ejecuta cuando se realiza una consulta con el metodo post a la ruta /api/logs/, espera que le manden
 * un objeto de tipo filtro (**vease frontend/js/filtros.js), y devuelve los datos del grafico generado
 * dependiendo de los filtros ingresados
 * */
router.post('/logs', async (req, res) => {
    const db = await connect();
    const collection = db.collection('registros');

    const datosGrafico = {};

    datosGrafico.labels = obtenerLabels(req.body.initialDateMs, req.body.lastDateMs);

    const fechaInicial = new Date(req.body.initialDateMs);
    const fechaFinal = new Date(req.body.lastDateMs);

    const mapa = new Map();
    const intervaloMs = (req.body.intervaloMinutos + 1) * 60000;

    await collection.find({"date": {"$gte": fechaInicial, "$lte": fechaFinal}})
    .forEach(reg => {
        const clave = obtenerClave(reg);
        const fechaActual = Date.parse(reg.date);

        if(mapa.has(clave)) {
            const usuario = mapa.get(clave);

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
            mapa.set(clave, nuevoUsuario);
        }

    });

    let lista = [];
    mapa.forEach(usuario => {
        if(usuario.temp.actual != usuario.temp.inicio) {
            if((usuario.temp.actual - usuario.temp.inicio) <= intervaloMs) {
                const nuevaSesion = {"inicio": usuario.temp.inicio, "final": usuario.temp.actual};
                usuario.sesiones.push(nuevaSesion);
            }

            if(usuario.sesiones.length > 0) {
                lista = lista.concat(usuario.sesiones);
            }
        }
    });

    datosGrafico.datasets = obtenerDatasets(lista, datosGrafico.labels);

    res.json(datosGrafico)
});

module.exports = router;