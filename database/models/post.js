'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING(512)
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
    Post.hasMany(models.comment, {
      foreignKey: 'commentableId',
      scope: {
        commentableType: 'post'
      },
      constrains: false,
      onDelete: 'CASCADE'
    });
  };
  return Post;
};