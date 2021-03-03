'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    commentable_id: DataTypes.INTEGER,
    commentable_type: DataTypes.STRING(10),
    message: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'comments',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Comment.hasMany(models.Comment, {
      foreignKey: 'commentable_id',
      scope: {
        commentable_type: 'comment'
      },
      constrains: false,
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Comment, {
      foreignKey: 'commentable_id',
      as: 'comment',
      constrains: false
    });

    Comment.belongsTo(models.Post, {
      foreignKey: 'commentable_id',
      constrains: false
    });
  };
  return Comment;
};
