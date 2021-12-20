const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', async function (req, res, next) {
    try {
        const pedido = await pedidoController.savePedido(req.body);
        res.status(201).json(pedido);
    } catch (err) {
        next(err);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const pedidos = await pedidoController.getPedidos();
        res.status(200).json(pedidos);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const pedido = await pedidoController.getPedidoPorId(req.params.id);
        res.status(200).json(pedido);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        await pedidoController.updatePedido(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await pedidoController.deletePedido(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/pedido', router);