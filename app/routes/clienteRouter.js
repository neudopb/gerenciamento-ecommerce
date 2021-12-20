const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const middleware = require('../middlewares/auth');

router.post('/', async function (req, res, next) {
    try {
        const cliente = await clienteController.saveCliente(req.body);
        res.status(201).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.get('/', middleware, async function (req, res, next) {
    try {
        const clientes = await clienteController.getClientes();
        res.status(200).json(clientes);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', middleware, async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorId(req.params.id);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', middleware, async function (req, res, next) {
    try {
        await clienteController.updateCliente(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', middleware, async function (req, res, next) {
    try {
        await clienteController.deleteCliente(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/email/:email', middleware, async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorEmail(req.params.email);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

router.get('/nome/:nome', middleware, async function (req, res, next) {
    try {
        const cliente = await clienteController.getClientePorNome(req.params.nome);
        res.status(200).json(cliente);
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/cliente', router);