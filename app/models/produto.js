'use strict';

module.exports = (sequelize, DataTypes) => {
  // Validações feitas no migrations
  const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    preco: DataTypes.REAL,
    codigo: DataTypes.STRING,
    caracteristicas: DataTypes.STRING,
    imagem_name: DataTypes.STRING,
    imagem_url: DataTypes.STRING,
  }, {});

  // Associação de muitos para muitos
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