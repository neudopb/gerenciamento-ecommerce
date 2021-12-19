const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./app/routes/index')(app);

app.use(function (error, req, res, next) {
    if (error.message === 'Not Found') {
        return res.status(404).send({error: error.message});
    } else if (error.message === 'Conflict') {
        return res.status(409).send({error: error.message});
    } else {
        return res.status(400).send({error: error.message});
    }
});

app.listen(3000);