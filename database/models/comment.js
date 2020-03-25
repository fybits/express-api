'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    userId: DataTypes.INTEGER,
    commentableId: DataTypes.INTEGER,
    commentableType: DataTypes.STRING(10),
    message: DataTypes.STRING
  }, {});

  Comment.associate = (models) => {
    Comment.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });

    Comment.hasMany(models.comment, {
      foreignKey: 'commentableId',
      scope: {
        commentableType: 'comment'
      },
      constrains: false,
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.comment, {
      foreignKey: 'commentableId',
      as: 'comment',
      constrains: false
    });

    Comment.belongsTo(models.post, {
      foreignKey: 'commentableId',
      constrains: false
    });
  };
  return Comment;
};
