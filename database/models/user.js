'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: DataTypes.STRING(64),
    firstName: DataTypes.STRING(64),
    lastName: DataTypes.STRING(64),
    password: DataTypes.STRING(65)
  }, {});
  User.associate = function(models) {
    User.hasMany(models.post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
