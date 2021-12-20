const Cliente = require('../models').Cliente;

function buscarEmail(email) {
    return Cliente.findOne({
        where: { email: email }
    });
};

exports.saveCliente = async function (body) {

    if (Object.keys(body).length === 0) throw new Error('Bad Request');

    const searchCliente = await buscarEmail(body.email);

    if (searchCliente) throw new Error('Conflict');

    return Cliente.create(body);
};

exports.getClientes = async function () {
    return Cliente.findAll();
};

exports.getClientePorId = async function (id) {

    const cliente = await Cliente.findOne({
        where: { id: id }
    });

    if (!cliente) throw new Error('Not Found');

    return cliente;
};

exports.updateCliente = async function (id, body) {
    if (Object.keys(body).length === 0) throw new Error('Bad Request');

    await exports.getClientePorId(id);

    const result = await Cliente.update(body, {
        where: { id: id }
    });
    
    if (result[0] === 0) throw new Error('Bad Request');

    return;
};

exports.deleteCliente = async function (id) {
    await exports.getClientePorId(id);

    return Cliente.destroy({
        where: { id: id }
    });
};
 
exports.getClientePorEmail = async function (email) {
    const cliente = await buscarEmail(email);

    if (!cliente) throw new Error('Not Found');

    return cliente;
};

exports.getClientePorNome = async function (nome) {
    const clientes = await Cliente.findAll({
        where: { nome: nome }
    });

    if (clientes.length === 0) throw new Error('Not Found');

    return clientes;
};