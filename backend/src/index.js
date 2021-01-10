/**
 * @fileoverview Contienen las configuraciones del server, los Middlewares y la funcion main que se encarga
 * de dejar el server escuchando por solicitudes
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Dependencias
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes/router');
const cors = require('cors');

// Configuraciones
app.set('port',process.env.PORT || 3000);
const configCors = [{origin: "localhost:3000", 
    credentials: true
}];

// Midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors(configCors));

// Routes
app.use('/api', router);

/**
 * Funcion que levanta el server
 * */
function main() {
    app.listen(app.get('port'), () => {
        console.log(`Server running on port ${app.get('port')}`);
    });
}

main();