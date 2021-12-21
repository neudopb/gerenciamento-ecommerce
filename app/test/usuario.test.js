const crypto = require('crypto');
const axios = require('axios');
const usuarioController = require('../controllers/usuarioController');
const clienteController = require('../controllers/clienteController');
const produtoController = require('../controllers/produtoController');
const pedidoController = require('../controllers/pedidoController');

const url = 'http://localhost:3000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJhbXMiOnsiaWQiOjR9LCJpYXQiOjE2NDAxMTU2MzMsImV4cCI6MTY0MDIwMjAzM30.ubGM7xMoYuQyKbFSCU61cRqS443ZhmWb04qoWQCts-I';

const generate = function () {
    return crypto.randomBytes(10).toString('hex');
};

const request = function (url, method, data, token) {
    if (token)
        axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
       
    return axios({url, method, data, validateStatus: false });
};


test('Teste get usuarios', async function () {
    const response = await request(`${url}/usuario/`, 'get', {}, token);
    expect(response.status).toBe(200);
});

test('Teste get id usuario', async function () {
    const usuario = await usuarioController.saveUsuario({ email: `${generate()}@example.com`, senha: generate() });

    const response = await request(`${url}/usuario/${usuario.id}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);
    expect(usuario.email).toBe(data.email);

    await usuarioController.deleteUsuario(usuario.id);
});

test('Teste get email usuario', async function () {
    const usuario = await usuarioController.saveUsuario({ email: `${generate()}@example.com`, senha: generate() });

    const response = await request(`${url}/usuario/email/${usuario.email}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);
    expect(usuario.id).toBe(data.id);

    await usuarioController.deleteUsuario(usuario.id);
});

test('Teste post usuario', async function () {
    const data = { email: `${generate()}@example.com`, senha: generate() };

    const response = await request(`${url}/usuario/`, 'post', data);
    const usuario = response.data;

    expect(response.status).toBe(201);
    expect(data.email).toBe(usuario.email);
    
    await usuarioController.deleteUsuario(usuario.id);
});

test('Teste put usuario', async function () {
    const usuario = await usuarioController.saveUsuario({ email: `${generate()}@example.com`, senha: generate() });
    usuario.senha = generate();

    const response = await request(`${url}/usuario/${usuario.id}`, 'put', usuario, token);
   
    expect(response.status).toBe(204);

    await usuarioController.deleteUsuario(usuario.id);
});

test('Teste delete usuario', async function () {
    const usuario = await usuarioController.saveUsuario({ email: `${generate()}@example.com`, senha: generate() });

    const response = await request(`${url}/usuario/${usuario.id}`, 'delete', {}, token);
    
    expect(response.status).toBe(204);
});


test('Teste get clientes', async function () {
    const response = await request(`${url}/cliente/`, 'get', {}, token);
    expect(response.status).toBe(200);
});

test('Teste get id cliente', async function () {
    const cliente = await clienteController.saveCliente({ nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() });

    const response = await request(`${url}/cliente/${cliente.id}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);
    expect(cliente.nome).toBe(data.nome);
    expect(cliente.email).toBe(data.email);

    await clienteController.deleteCliente(cliente.id);
});

test('Teste get email cliente', async function () {
    const cliente = await clienteController.saveCliente({ nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() });

    const response = await request(`${url}/cliente/email/${cliente.email}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);
    expect(cliente.id).toBe(data.id);

    await clienteController.deleteCliente(cliente.id);
});

test('Teste get nome cliente', async function () {
    const cliente = await clienteController.saveCliente({ nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() });

    const response = await request(`${url}/cliente/nome/${cliente.nome}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);

    await clienteController.deleteCliente(cliente.id);
});

test('Teste post cliente', async function () {
    const data = { nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() };
    
    const response = await request(`${url}/cliente/`, 'post', data);
    const cliente = response.data;

    expect(response.status).toBe(201);
    expect(data.email).toBe(cliente.email);
    
    await clienteController.deleteCliente(cliente.id);
});

test('Teste put cliente', async function () {
    const cliente = await clienteController.saveCliente({ nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() });
    cliente.nome = generate();

    const response = await request(`${url}/cliente/${cliente.id}`, 'put', cliente, token);
   
    expect(response.status).toBe(204);

    await clienteController.deleteCliente(cliente.id);
});

test('Teste delete cliente', async function () {
    const cliente = await clienteController.saveCliente({ nome: generate(), email: `${generate()}@example.com`, telefone: "88999999999", endereco: generate() });
    
    const response = await request(`${url}/cliente/${cliente.id}`, 'delete', {}, token);
    
    expect(response.status).toBe(204);
});

test('Teste get produtos', async function () {
    const response = await request(`${url}/produto/`, 'get', {}, token);
    expect(response.status).toBe(200);
});

test('Teste get id produto', async function () {
    const produto = await produtoController.saveProduto({ nome: generate(), preco: 10.5, codigo: "95432", caracteristicas: generate() });

    const response = await request(`${url}/produto/${produto.id}`, 'get', {}, token);
    const data = response.data;

    expect(response.status).toBe(200);
    expect(produto.nome).toBe(data.nome);
    expect(produto.preco).toBe(data.preco);

    await produtoController.deleteProduto(produto.id);
});

test('Teste delete produto', async function () {
    const produto = await produtoController.saveProduto({ nome: generate(), preco: 10.5, codigo: "95432", caracteristicas: generate() });

    const response = await request(`${url}/produto/${produto.id}`, 'delete', {}, token);
    
    expect(response.status).toBe(204);
});

test('Teste get pedidos', async function () {
    const response = await request(`${url}/pedido/`, 'get', {}, token);
    expect(response.status).toBe(200);
});