const Produto = require('../models').Produto;
const yup = require('yup');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

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

function delete_imagem(name) {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3
            .deleteObject({
                Bucket: "image-upload-neudo",
                Key: name
            })
            .promise();
    } else {
        const path_file = path.resolve(__dirname, "..", "..", "tmp", name)
        if (fs.existsSync(path_file))
            return promisify(fs.unlink) (path_file);
    }
}

exports.saveProduto = async function (body) {
    try {
        await schema.validate(body);
    } catch (err) {
        throw new Error('Bad Request - ' + err.errors);
    }

    if (!body.imagem_url) {
        body.imagem_url = `${process.env.APP_URL}/files/${body.imagem_name}`;
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

    if (body.imagem_name && body.imagem_name !== produto.imagem_name) {
        try {
            delete_imagem(produto.imagem_name);
        } catch (err) {
            console.log('Não existe a imagem - ', err.message);
        }
        if (!body.imagem_url) {
            body.imagem_url = `${process.env.APP_URL}/files/${body.imagem_name}`;
        }
    }

    return produto.update(body);
};

exports.deleteProduto = async function (id) {
    const produto = await exports.getProdutoPorId(id);

    try {
        delete_imagem(produto.imagem_name);
    } catch (err) {
        console.log('Não existe a imagem - ', err.message);
    }

    return produto.destroy();
};