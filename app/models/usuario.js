"use strict";
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  // Validações feitas no migrations
  const Usuario = sequelize.define('Usuario', {
    email: DataTypes.STRING,
    senha: DataTypes.STRING
  },
  {
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10); // Criptografar a senha antes de salvar
        }
      }
    }
  });
  
  return Usuario;
};