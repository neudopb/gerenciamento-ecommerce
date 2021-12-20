const Produto = require('../models').Produto;

exports.saveProduto = async function (body) {

    if (Object.keys(body). length === 0) throw new Error('Bad Request');
    
    return Produto.create(body);
};

exports.getProdutos = async function () {
    return Produto.findAll();
};

exports.getProdutoPorId = async function (id) {
    // return Produto.findOne(id);
    const produto = await Produto.findOne({
        where: {id: id}
    });

    if (!produto) throw new Error('Not Found');

    return produto;
};

exports.updateProduto = async function (id, body) {
    if (Object.keys(body). length === 0) throw new Error('Bad Request');

    await exports.getProdutoPorId(id);

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