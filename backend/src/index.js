const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes/router');
const cors = require('cors');
const configCors = [{origin: "localhost:3000", 
    credentials: true
}];

// Settings
app.set('port',process.env.PORT || 3000);

// Midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors(configCors));

// Routes
app.use('/api', router);

const connect = require('./database');

async function main() {
    await app.listen(app.get('port'), () => {
        console.log(`Server running on port ${app.get('port')}`);
    });
    
}

main();