const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./routes/router');

// Settings
app.set('port',process.env.PORT || 3000);

// Midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/api', router);

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
})