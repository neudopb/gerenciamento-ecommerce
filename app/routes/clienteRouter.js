const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', async function (req, res, next) {
    try {
        const cliente = await clienteController.saveCliente(req.body);
        res.status(201).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const clientes = await clienteController.getClientes();
        res.status(200).json(clientes);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorId(req.params.id);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.get('/email/:email', async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorEmail(req.params.email);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.get('/nome/:nome', async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorNome(req.params.nome);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        await clienteController.updateCliente(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await clienteController.deleteCliente(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/cliente', router);