'use strict';

module.exports = (sequelize, DataTypes) => {
  // Validações feitas no migrations
  const PedidoProduto = sequelize.define('PedidoProduto', {
    pedido_id: DataTypes.INTEGER,
    produto_id: DataTypes.INTEGER
  }, {});
  
  return PedidoProduto;
};