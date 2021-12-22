const { Pedido, Produto, Cliente } = require('../models');
const Sequelize = require('sequelize');
const yup = require('yup');
const moment = require('moment');
const Op = Sequelize.Op;

// Validação de formulário
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

// Validação de formulário para atualização
const schemaUpdate = yup.object().shape({
    cliente_id: yup.number("Necessário preencher o campo cliente_id")
        .positive("Necessário informar um valor positivo")
        .integer("Necessário informar um valor inteiro"),
    data: yup.date("Necessário informar uma data válida"),
    status: yup.mixed().oneOf(["pendente", "cancelado", "pago"], "Status deve ser 'pendente', 'cancelado' ou 'pago'"),
    produtos: yup.array(),
});

// Função para validar data
function validarData(data) {
    return moment(data, 'YYYY-MM-DD', true).isValid();
}

exports.savePedido = async function (body) {
    // Verifica se a data informada é valida
    if (!validarData(body.data)) {
        throw new Error('Bad Request - O formato da data deve ser YYYY-MM-DD');
    }

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
    // Verifica se a data informada é valida
    if (body.data && !validarData(body.data))
        throw new Error('Bad Request - O formato da data deve ser YYYY-MM-DD');

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
    if (!id) throw new Error('Bad Request - parametro inválido');

    const pedidos = await Pedido.findAll({
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

    if (pedidos.length === 0) throw new Error('Not Found - pedidos não encontrado');

    return pedidos;
};

exports.getPedidoPorAno = async function (ano) {
    if (!ano) throw new Error('Bad Request - parametro inválido');
    
    // Verifica se existe pedidos dentro do ano informado
    const pedidos = await Pedido.findAll({
        where: { [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('data')), '>=', `${ano}-01-01`),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('data')), '<=', `${ano}-12-31`),
        ] },
        include: [
            { model: Cliente },
            {
                model: Produto,
                as: 'produtos',
                through: { attributes: [] },
            },
        ],
    });

    if (pedidos.length === 0) throw new Error('Not Found - pedidos não encontrado');

    return pedidos;
};