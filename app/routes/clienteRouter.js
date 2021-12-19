const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/cadastrar', async function (req, res, next) {
    try {
        const usuario = await clienteController.saveCliente(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/cliente', router);