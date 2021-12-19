const Cliente = require('../models').Cliente;

exports.saveCliente = async function (body) {
    const searchCliente = await exports.getClientePorEmail(body.email);

    if (searchCliente) throw new Error('Conflict');

    return Cliente.create(body);
};

exports.getClientes = async function () {
    return Cliente.findAll();
};

exports.getClientePorId = async function (id) {
    return Cliente.findOne({
        where: { id: id }
    });
}

exports.getClientePorEmail = async function (email) {
    return Cliente.findOne({
        where: { email: email }
    });
};

exports.getClientePorNome = async function (nome) {
    return Cliente.findAll({
        where: { nome: nome }
    });
};

exports.updateCliente = async function (body) {
    const cliente = await exports.getClientePorId(body.id);

    if (!cliente) throw new Error('Not Found');

    return Cliente.update({
        nome: body.nome || cliente.nome,
        email: body.email || cliente.email,
        telefone: body.telefone || cliente.telefone,
        endereco: body.endereco || cliente.endereco,
        },
        {returning: true, where: {id: body.id}}
    );
};

exports.deleteCliente = async function (id) {
    const cliente = await exports.getClientePorId(id);

    if (!cliente) throw new Error('Not Found');

    return Cliente.destroy({
        where: { id: id }
    });
};