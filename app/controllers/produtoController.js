const Produto = require('../models').Produto;

exports.saveProduto = async function (body) {
    return Produto.create(body);
};

exports.getProdutos = async function () {
    return Produto.findAll();
};

exports.getProdutoPorId = async function (id) {
    // return Produto.findOne(id);
    return Produto.findOne({
        where: {id: id}
    });
};

exports.updateProduto = async function (id, body) {
    const produto = await exports.getProdutoPorId(id);

    if (!produto) throw new Error('Not Found');

    return Produto.update(body, 
        {where: {id: id}}
    );
};

exports.deleteProduto = async function (id) {
    const produto = await exports.getProdutoPorId(id);

    if (!produto) throw new Error('Not Found');

    return Produto.destroy({
        where: { id: id}
    });
};