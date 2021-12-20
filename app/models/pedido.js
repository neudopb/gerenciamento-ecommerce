'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    cliente_id: DataTypes.INTEGER,
    data: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("pendente", "cancelado", "pago"),
      defaultValue: "pendente"
    }
  }, {});

  Pedido.associate = function (models) {
    Pedido.belongsTo(models.Cliente, {
      foreignKey: "cliente_id",
      onDelete: 'CASCADE',
    });

    Pedido.belongsToMany(models.Produto, {
      through: 'PedidoProduto',
      as: 'produtos',
      foreignKey: "pedido_id",
      onDelete: 'CASCADE',
    });
  };

  return Pedido;
};