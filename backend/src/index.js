const express = require('express');
const app = express();
const morgan = require('morgan');

// Settings
app.set('port',process.env.PORT || 3000);

// Midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
})