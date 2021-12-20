const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', async function (req, res, next) {
    try {
        const usuario = await usuarioController.saveUsuario(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async function (req, res, next) {
    try {
        const { usuario, token } = await usuarioController.login(req.body);
        res.status(200).json({ usuario, token });
    } catch (err) {
        next(err);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const usuarios = await usuarioController.getUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const usuario = await usuarioController.getUsuarioPorId(req.params.id);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        await usuarioController.updateUsuario(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await usuarioController.deleteUsuario(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/email/:email', async function (req, res, next) {
    try {
        const usuario = await usuarioController.getUsuarioPorEmail(req.params.email);
        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
});

module.exports = app => app.use('/usuario', router);