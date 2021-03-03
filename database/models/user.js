'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING(64),
    first_name: DataTypes.STRING(64),
    last_name: DataTypes.STRING(64),
    password: DataTypes.STRING(65),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'user_id',
      as: 'posts',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
