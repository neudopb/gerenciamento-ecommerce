const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const app = express();
const swaggerDocs = require('./app/swagger');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Rota para a documentação 
app.use('/files', express.static(path.resolve(__dirname, 'tmp'))); // Rota para gerenciar as imagens

require('./app/routes/index')(app);

// Tratamento dos erros
app.use(function (error, req, res, next) {
    if (error.message.includes('Bad Request')) {
        return res.status(400).send({erro: error.message});
    } else if (error.message.includes('Not Found')) {
        return res.status(404).send({erro: error.message});
    } else if (error.message.includes('Unauthorized')) {
        return res.status(401).send({erro: error.message});
    } else if (error.message.includes('Conflict')) {
        return res.status(409).send({erro: error.message});
    } else {
        return res.status(500).send({erro: error.message});
    }
});

app.listen(3000);