const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const middleware = require('../middlewares/auth');
const multer = require('multer');
const multerConfig = require('../../config/multer');

const upload = multer(multerConfig);

router.post('/', middleware, upload.single('imagem'), async function (req, res, next) {
    try {
        const body = req.body;

        try {
            const { key, location: url = "" } = req.file;
            if (key) body['imagem_name'] = key;
            if (url) body['imagem_url'] = url;
        } catch (err) {}
        
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

router.put('/:id', middleware, upload.single('imagem'), async function (req, res, next) {
    try {
        const body = req.body;
        
        try {
            const { key, location: url = "" } = req.file;
            if (key) body['imagem_name'] = key;
            if (url) body['imagem_url'] = url;
        } catch (err) {}

        await produtoController.updateProduto(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', middleware, async function (req, res, next) {
    try {
        await produtoController.deleteProduto(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/produto', router);