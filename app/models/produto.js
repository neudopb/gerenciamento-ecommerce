'use strict';

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    preco: DataTypes.REAL,
    codigo: DataTypes.STRING,
    caracteristicas: DataTypes.STRING
  }, {});
  
  return Produto;
};