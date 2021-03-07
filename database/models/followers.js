'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define('Followers', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    }
  }, {
    tableName: 'follows',
    timestamps: false,
  });

  return Followers;
};
