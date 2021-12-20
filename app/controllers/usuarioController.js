const Usuario = require('../models').Usuario;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
};

function buscarEmail(email) {
    return Usuario.findOne({ 
        where: { email: email }
    });
};

exports.saveUsuario = async function(body) {
    if (Object.keys(body).length === 0) throw new Error('Bad Request');

    const searchUsuario = await buscarEmail(body.email);

    if (searchUsuario) throw new Error('Conflict');
    
    const usuario = await Usuario.create(body);

    return {
        usuario,
        token: generateToken({ id: usuario.id})
    };
};

exports.login = async function(body) {
    if (Object.keys(body).length === 0) throw new Error('Bad Request');

    const usuario = await getUsuarioPorEmail(body.email);

    if (!usuario) throw new Error({error: 'Not Found'});

    if (!await bcrypt.compare(body.senha, usuario.senha))
        throw new Error({error: 'Not Found'});

    usuario.senha = undefined;

    return {
        usuario: usuario,
        token: generateToken({ id: usuario.id })
    }
};

exports.getUsuarios = async function () {
    return Usuario.findAll();
};

exports.getUsuarioPorId = async function (id) {
    const usuario = await Usuario.findOne({
        where: { id: id }
    });

    if (!usuario) throw new Error('Not Found');

    return usuario;
};

exports.updateUsuario = async function (id, body) {
    if (Object.keys(body).length === 0) throw new Error('Bad Request');

    await exports.getUsuarioPorId(id);

    const result = await Usuario.update(body, {
        where: { id: id }
    });

    if (result[0] === 0) throw new Error('Bad Request');

    return;
};

exports.deleteUsuario = async function (id) {
    await exports.getUsuarioPorId(id);

    return Usuario.destroy({
        where: { id: id }
    });
};

exports.getUsuarioPorEmail = async function (email) {
    const usuario = await buscarEmail(email);

    if (!usuario) throw new Error('Not Found');

    return usuario;
};