'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PedidoProdutos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pedido_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE'
      },
      produto_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PedidoProdutos');
  }
};