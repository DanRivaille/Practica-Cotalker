const MongoClient = require('mongodb').MongoClient;

async function connect() {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/', {
            useUnifiedTopology: true
        });

        const db = client.db('Servidor');
        console.log('Db is Connected');

        return db;
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = connect;