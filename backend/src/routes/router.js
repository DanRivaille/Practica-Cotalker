/**
 * @fileoverview Contiene las rutas de la API y las funciones que se ejecutan dependiendo de los metodos realizados
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Dependencias
const Router = require('express').Router;
const router = Router();
const connect = require('../database');
const {obtenerIntervalos, procesarRegistros, obtenerDatasets} = require('../datos.grafico');

/**
 * Metodo GET (/api/): envia un mensaje de bienvenida a la API
 * */
router.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

/**
 * Metodo GET (/api/logs): este devuelve las fechas limite validas dependiendo de los logs cargados en la DB
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
 * Metodo POST (/api/logs/): espera que le manden un objeto de tipo filtro (**vease frontend/js/filtros.js), 
 * y devuelve los datos del grafico generado dependiendo de los filtros ingresados.
 * */
router.post('/logs', async (req, res) => {
    const db = await connect();
    const collection = db.collection('registros');

    const usuarios = new Map();
    const intervaloMs = minutosAMilisegundos(req.body.intervaloMinutos);
    const filtroQuery = crearFiltroQuery(req.body);

    await collection.find(filtroQuery)
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

/**
 * @param {Object} filtro Contiene los filtros del formulario HTML que indica como se generara el grafico
 * @returns {Object} filtro que se utilizara en la consulta a la DB Mongo.
 * */
function crearFiltroQuery(filtro) {
    const fechaInicial = new Date(filtro.initialDateMs);
    const fechaFinal = new Date(filtro.lastDateMs);

    const filtroQuery = {"date": {"$gte": fechaInicial, "$lte": fechaFinal}};

    if(filtro.companyId != -1)
        filtroQuery.companyId = filtro.companyId;

    if(filtro.userId != -1)
        filtroQuery.userId = filtro.userId;

    return filtroQuery;
}

/**
 * @param {int} minutos cantidad de tiempo representada en minutos
 * @returns {bigint} Cantidad de tiempo ingresada representada en milisegundos
 * */
function minutosAMilisegundos(tiempoEnMinutos) {
    const MINUTO_EN_MILISEGUNDOS = 60000;
    const tiempoEnMilisegundos = (tiempoEnMinutos + 1) * MINUTO_EN_MILISEGUNDOS;

    return tiempoEnMilisegundos;
}

// Se exporta el objeto router que se usa en index.js
module.exports = router;