const { Pedido, Produto, Cliente } = require('../models');

exports.savePedido = async function (body) {
    const { produtos, ...data } = body;

    const cliente = await Cliente.findOne({ 
        where: { id: body.cliente_id }
    });

    if (!cliente) throw new Error('Not Found');

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

    if (!pedido) throw new Error('Not Found');

    return pedido;
};

exports.updatePedido = async function(id, body) {
    if (Object.keys(body).length === 0) throw new Error('Bad Request');

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