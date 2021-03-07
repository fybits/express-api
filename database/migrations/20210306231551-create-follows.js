'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('follows', {
    'user_id': {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    'follower_id': {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    }
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('follows'),
};
