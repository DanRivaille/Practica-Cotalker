const Router = require('express').Router;
const router = Router();

router.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

router.get('/logs', async (req, res) => {
    res.send('Registros de logs');
});

router.post('/logs', async (req, res) => {
    res.json(req.body)
});


module.exports = router;