const Produto = require('../models').Produto;
const yup = require('yup');

const schema = yup.object().shape({
    nome: yup.string("Necessário preencher o campo nome")
        .required("Necessário preencher o campo nome"),
    preco: yup.number("Necessário preencher o campo preço")
        .required("Necessário preencher o campo preço")
        .positive("Necessário informar um preço positivo"),
    codigo: yup.string("Necessário preencher o campo código")
        .required("Necessário preencher o campo código"),
    caracteristicas: yup.string("Necessário preencher o campo características")
        .required("Necessário preencher o campo características"),
});

const schemaUpdate = yup.object().shape({
    nome: yup.string("Necessário preencher o campo nome"),
    preco: yup.number("Necessário preencher o campo preço")
        .positive("Necessário informar um preço positivo"),
    codigo: yup.string("Necessário preencher o campo código"),
    caracteristicas: yup.string("Necessário preencher o campo características"),
});

exports.saveProduto = async function (body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }
    
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

    if (!produto) throw new Error('Not Found - Produto não encontrado');

    return produto;
};

exports.updateProduto = async function (id, body) {
    try {
        await schemaUpdate.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    const produto = await exports.getProdutoPorId(id);

    return produto.update(body);
};

exports.deleteProduto = async function (id) {
    const produto = await exports.getProdutoPorId(id);

    return produto.destroy();
};