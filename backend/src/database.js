/**
 * @fileoverview Contiene la funcion que se conecta a la DB Mongo.
 * 
 * @author Dan Santos
 * @version 1.0
 * */

// Dependencias
const MongoClient = require('mongodb').MongoClient;

// Configuraciones
const url = 'mongodb://localhost:27017/';
const paramsDB = {useUnifiedTopology: true};

/**
 * @returns {Db} Objeto de conexion a la DB, si ocurren un error, muestra la excepcion y retorna null
 * */
async function connect() {
    try {
        const client = await MongoClient.connect(url, paramsDB);

        const db = client.db('Servidor');
        console.log('Db is Connected');

        return db;
    } catch (e) {
        console.log(e);
        return null;
    }
}

// Se exporta la funcion para conectarse a la BD
module.exports = connect;