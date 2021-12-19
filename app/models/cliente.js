'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    endereco: DataTypes.STRING
  }, {});

  return Cliente;
};