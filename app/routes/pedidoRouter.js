const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const middleware = require('../middlewares/auth');

router.post('/', async function (req, res, next) {
    try {
        const pedido = await pedidoController.savePedido(req.body);
        res.status(201).json(pedido);
    } catch (err) {
        next(err);
    }
});

router.get('/', middleware, async function (req, res, next) {
    try {
        const pedidos = await pedidoController.getPedidos();
        res.status(200).json(pedidos);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', middleware, async function (req, res, next) {
    try {
        const pedido = await pedidoController.getPedidoPorId(req.params.id);
        res.status(200).json(pedido);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', middleware, async function (req, res, next) {
    try {
        await pedidoController.updatePedido(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', middleware, async function (req, res, next) {
    try {
        await pedidoController.deletePedido(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/cliente/:id', middleware, async function (req, res, next) {
    try {
        const pedidos = await pedidoController.getPedidoPorCliente(req.params.id);
        res.status(200).json(pedidos);
    } catch (err) {
        next(err);
    }
});

router.get('/ano/:ano', middleware, async function (req, res, next) {
    try {
        const pedidos = await pedidoController.getPedidoPorAno(req.params.ano);
        res.status(200).json(pedidos);
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/pedido', router);