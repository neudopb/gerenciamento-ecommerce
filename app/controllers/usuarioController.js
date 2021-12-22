const Usuario = require('../models').Usuario;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const authConfig = require('../../config/auth.json');

// Validação de formulário
const schema = yup.object().shape({
    email: yup.string("Necessário preencher o campo E-mail")
        .required("Necessário preencher o campo E-mail")
        .email("Necessário preencher o campo com E-mail válido"),
    senha: yup.string("Necessário preencher o campo senha")
        .required("Necessário preencher o campo senha")
        .min(6, "Senha deve ter no mínimo 6 caracteres")
});

// Validação de formulário para atualização
const schemaUpdate = yup.object().shape({
    email: yup.string("Necessário preencher o campo E-mail")
        .email("Necessário preencher o campo com E-mail válido"),
    senha: yup.string("Necessário preencher o campo senha")
        .min(6, "Senha deve ter no mínimo 6 caracteres")
});

// Função para gerar um token
function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
};

// Função para busca de e-mail
function buscarEmail(email) {
    return Usuario.findOne({ 
        where: { email: email }
    });
};

exports.saveUsuario = async function(body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const searchUsuario = await buscarEmail(body.email);

    if (searchUsuario) throw new Error('Conflict - E-mail já cadastrado');
    
    const usuario = await Usuario.create(body);

    return usuario;
};

exports.login = async function(body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const usuario = await buscarEmail(body.email);

    if (!usuario) throw new Error('Not Found - Usuário não encontrado');
    

    if (!await bcrypt.compare(body.senha, usuario.senha))
        throw new Error('Not Found - Senha incorreta');

    usuario.senha = undefined;

    return {
        usuario: usuario,
        token: generateToken({ id: usuario.id })
    }
};

exports.getUsuarios = async function () {
    return Usuario.findAll({
        attributes: { exclude: ['senha']}
    });
};

exports.getUsuarioPorId = async function (id) {
    const usuario = await Usuario.findOne({
        where: { id: id },
        attributes: { exclude: ['senha']}
    });

    if (!usuario) throw new Error('Not Found - Usuário não encontrado');

    return usuario;
};

exports.updateUsuario = async function (id, body) {
    try {
        await schemaUpdate.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    await exports.getUsuarioPorId(id);

    if (body.senha){
        body.senha = await bcrypt.hash(body.senha, 10);
    }

    return Usuario.update(body, {
        where: { id: id }
    });
};

exports.deleteUsuario = async function (id) {
    const usuario = await exports.getUsuarioPorId(id);

    return usuario.destroy();
};

exports.getUsuarioPorEmail = async function (email) {
    const usuario = await buscarEmail(email);

    if (!usuario) throw new Error('Not Found - Usuário não encontrado');

    usuario.senha = undefined;

    return usuario;
};