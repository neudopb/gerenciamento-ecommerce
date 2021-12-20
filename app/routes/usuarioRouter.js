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
})

module.exports = app => app.use('/usuario', router);