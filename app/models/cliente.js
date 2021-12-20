'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    endereco: DataTypes.STRING
  }, {});

  Cliente.associate = function(models) {
    Cliente.hasMany(models.Pedido, {
      foreignKey: 'cliente_id',
      as: 'pedidos',
      onDelete: 'CASCADE',
    });
  };

  return Cliente;
};