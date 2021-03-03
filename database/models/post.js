'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING(512),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    tableName: 'posts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'commentable_id',
      scope: {
        commentable_type: 'post'
      },
      constrains: false,
      onDelete: 'CASCADE'
    });
  };
  return Post;
};