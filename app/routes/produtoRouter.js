const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.post('/', async function (req, res, next) {
    try {
        const produto = await produtoController.saveProduto(req.body);
        res.status(201).json(produto);
    } catch (err) {
        next(err);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const produtos = await produtoController.getProdutos();
        res.status(200).json(produtos);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const produto = await produtoController.getProdutoPorId(req.params.id);
        res.status(200).json(produto);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        await produtoController.updateProduto(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await produtoController.deleteProduto(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/produto', router);