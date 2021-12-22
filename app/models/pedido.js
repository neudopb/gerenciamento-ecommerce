'use strict';

module.exports = (sequelize, DataTypes) => {
  // Validações feitas no migrations
  const Pedido = sequelize.define('Pedido', {
    cliente_id: DataTypes.INTEGER,
    data: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("pendente", "cancelado", "pago"),
      defaultValue: "pendente"
    }
  }, {});

  Pedido.associate = function (models) {
    // Associação pedido pertence a um cliente
    Pedido.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
      onDelete: 'CASCADE',
    });
    // Associação de muitos para muitos
    Pedido.belongsToMany(models.Produto, {
      through: 'PedidoProduto',
      as: 'produtos',
      foreignKey: "pedido_id",
      onDelete: 'CASCADE',
    });
  };

  return Pedido;
};