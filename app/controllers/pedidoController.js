const { Pedido, Produto, Cliente } = require('../models');
const Sequelize = require('sequelize');
const yup = require('yup');

const schema = yup.object().shape({
    cliente_id: yup.number("Necessário preencher o campo cliente_id")
        .required("Necessário preencher o campo cliente_id")
        .positive("Necessário informar um valor positivo")
        .integer("Necessário informar um valor inteiro"),
    data: yup.date("Necessário informar uma data válida")
        .required("Necessário preencher o campo data"),
    status: yup.mixed().oneOf(["pendente", "cancelado", "pago"], "Status deve ser 'pendente', 'cancelado' ou 'pago'"),
    produtos: yup.array(),
});

const schemaUpdate = yup.object().shape({
    cliente_id: yup.number("Necessário preencher o campo cliente_id")
        .positive("Necessário informar um valor positivo")
        .integer("Necessário informar um valor inteiro"),
    data: yup.date("Necessário informar uma data válida"),
    status: yup.mixed().oneOf(["pendente", "cancelado", "pago"], "Status deve ser 'pendente', 'cancelado' ou 'pago'"),
    produtos: yup.array(),
});

exports.savePedido = async function (body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const { produtos, ...data } = body;

    const cliente = await Cliente.findOne({ 
        where: { id: body.cliente_id }
    });

    if (!cliente) throw new Error('Not Found - Cliente não encontrado');

    const pedido = await Pedido.create(data);

    if (produtos && produtos.length > 0) {
        pedido.setProdutos(produtos);
    }

    return pedido;
};

exports.getPedidos = async function () {
    return Pedido.findAll({
        include: [
            { model: Cliente },
            {
                model: Produto,
                as: 'produtos',
                through: { attributes: [] },
            },
        ],
    });
};

exports.getPedidoPorId = async function(id) {
    const pedido = await Pedido.findOne({
        where: { id: id },
        include: [
            { model: Cliente },
            {
                model: Produto,
                as: 'produtos',
                through: { attributes: [] },
            },
        ],
    });

    if (!pedido) throw new Error('Not Found - Pedido não encontrado');

    return pedido;
};

exports.updatePedido = async function(id, body) {
    try {
        await schemaUpdate.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const pedido = await exports.getPedidoPorId(id);

    const { produtos, ...data } = body;

    await pedido.update(data);

    if (produtos && produtos.length > 0) {
        await pedido.setProdutos(produtos);
    }
};

exports.deletePedido = async function (id) {
    const pedido = await exports.getPedidoPorId(id);
    
    return pedido.destroy();
};

exports.getPedidoPorCliente = async function (id) {
    return Pedido.findAll({
        where: { cliente_id: id },
        include: [
            { model: Cliente },
            {
                model: Produto,
                as: 'produtos',
                through: { attributes: [] },
            },
        ],
    });
};