const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/cadastrar', async function (req, res) {
    try {
        const usuario = await usuarioController.saveUser(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        console.log(err);
        res.status(400).send({error: "Bad Request"});
    }
});

module.exports = app => app.use('/usuario', router);