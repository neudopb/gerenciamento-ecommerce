const Usuario = require('../models').Usuario;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}

async function getUsuarioPorEmail(email) {
    const searchUsuario = await Usuario.findOne({ 
        where: { email: email }
    });

    return searchUsuario;
}

exports.saveUsuario = async function(body) {
    const searchUsuario = await getUsuarioPorEmail(body.email);

    if (searchUsuario) throw new Error('Conflict');
    
    const usuario = await Usuario.create(body);

    return {
        usuario,
        token: generateToken({ id: usuario.id})
    };
}

exports.login = async function(body) {
    const usuario = await getUsuarioPorEmail(body.email);

    if (!usuario) throw new Error({error: 'Not Found'});

    if (!await bcrypt.compare(body.senha, usuario.senha))
        throw new Error({error: 'Not Found'});

    usuario.senha = undefined;

    return {
        usuario: usuario,
        token: generateToken({ id: usuario.id })
    }
}