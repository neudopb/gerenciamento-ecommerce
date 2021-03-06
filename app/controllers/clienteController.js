const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cliente = require('../models').Cliente;
const yup = require('yup');

// Validação de formulário
const schema = yup.object().shape({
    nome: yup.string("Necessário preencher o campo nome")
        .required("Necessário preencher o campo nome"),
    email: yup.string("Necessário preencher o campo E-mail")
        .required("Necessário preencher o campo E-mail")
        .email("Necessário preencher o campo com E-mail válido"),
    telefone: yup.string("Necessário preencher o campo telefone")
        .required("Necessário preencher o campo telefone")
        .min(10, "Telefone deve ter no mínimo 10 números"),
    endereco: yup.string("Necessário preencher o campo endereço")
        .required("Necessário preencher o campo endereço")
});

// Validação de formulário para atualização
const schemaUpdade = yup.object().shape({
    nome: yup.string("Necessário preencher o campo nome"),
    email: yup.string("Necessário preencher o campo E-mail")
        .email("Necessário preencher o campo com E-mail válido"),
    telefone: yup.string("Necessário preencher o campo telefone")
        .min(10, "Telefone deve ter no mínimo 10 números"),
    endereco: yup.string("Necessário preencher o campo endereço")
});

// Função para busca de e-mail
function buscarEmail(email) {
    return Cliente.findOne({
        where: { email: email }
    });
};

exports.saveCliente = async function (body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const searchCliente = await buscarEmail(body.email);

    if (searchCliente) throw new Error('Conflict - E-mail já cadastrado');

    return Cliente.create(body);
};

exports.getClientes = async function () {
    return Cliente.findAll();
};

exports.getClientePorId = async function (id) {
    const cliente = await Cliente.findOne({
        where: { id: id }
    });

    if (!cliente) throw new Error('Not Found - Cliente não encontrado');

    return cliente;
};

exports.updateCliente = async function (id, body) {
    try {
        await schemaUpdade.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }
    const cliente = await exports.getClientePorId(id);

    return cliente.update(body);
};

exports.deleteCliente = async function (id) {
    const cliente = await exports.getClientePorId(id);

    return cliente.destroy();
};
 
exports.getClientePorEmail = async function (email) {
    const cliente = await buscarEmail(email);

    if (!cliente) throw new Error('Not Found - Cliente não encontrado');

    return cliente;
};

exports.getClientePorNome = async function (nome) {
    // Busca por parte de um nome
    const query = `%${nome}%`
    const clientes = await Cliente.findAll({
        where: { nome: { [Op.like]: query} }
    });

    if (clientes.length === 0) throw new Error('Not Found - Cliente não encontrado');

    return clientes;
};