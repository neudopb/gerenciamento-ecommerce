'use strict';

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    preco: DataTypes.REAL,
    codigo: DataTypes.STRING,
    caracteristicas: DataTypes.STRING
  }, {});

  Produto.associate = function (models) {
    Produto.belongsToMany(models.Pedido, {
      through: 'PedidoProduto',
      as: 'pedidos',
      foreignKey: 'produto_id',
      onDelete: 'CASCADE',
    });
  };
  
  return Produto;
};