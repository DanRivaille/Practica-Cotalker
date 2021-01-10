const Router = require('express').Router;
const router = Router();
const connect = require('../database');
const {obtenerIntervalos, procesarRegistros, obtenerDatasets} = require('../datos.grafico');

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

    const fechaInicial = new Date(req.body.initialDateMs);
    const fechaFinal = new Date(req.body.lastDateMs);

    const usuarios = new Map();
    const intervaloMs = (req.body.intervaloMinutos + 1) * 60000;

    await collection.find({"date": {"$gte": fechaInicial, "$lte": fechaFinal}})
    .forEach(registro => {
        procesarRegistros(registro, usuarios, intervaloMs);
    });

    const intervalos = obtenerIntervalos(req.body.initialDateMs, req.body.lastDateMs);

    const datosGrafico = {
        datasets: obtenerDatasets(usuarios, intervaloMs, intervalos),
        labels: intervalos.slice(0, -1)
    }

    res.json(datosGrafico)
});

module.exports = router;