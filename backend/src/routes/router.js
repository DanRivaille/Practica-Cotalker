const Router = require('express').Router;
const router = Router();
const connect = require('../database');

router.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

router.get('/logs', async (req, res) => {
    const db = await connect();
    const collection = db.collection('logs');

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

router.post('/logs', async (req, res) => {
    res.json(req.body)
});


module.exports = router;