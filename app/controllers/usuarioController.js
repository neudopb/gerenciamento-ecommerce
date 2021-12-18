const Usuario = require('../models').Usuario;

exports.saveUser = async function(user) {
    console.log(user);
    const newUsuario = await Usuario.create(user);

    return newUsuario;
}
