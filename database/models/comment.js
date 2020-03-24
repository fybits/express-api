'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = require('sequelize');
  class Comment extends Sequelize.Model {
    getCommentable() {
      if (!this.commentableType) return Promise.resolve(null);
      let funcName = this.commentableType;
      funcName = `get${funcName.charAt(0).toUpperCase() + funcName.substring(1)}`;
      return this[funcName]();
    }
  };
  Comment.init({
    userId: DataTypes.INTEGER,
    commentableId: DataTypes.INTEGER,
    commentableType: DataTypes.STRING(10),
    message: DataTypes.STRING
  }, { sequelize, modelName: 'comment' });

  // const Comment = sequelize.define('comment', {
  //   email: DataTypes.STRING(64),
  //   firstName: DataTypes.STRING(64),
  //   lastName: DataTypes.STRING(64),
  //   password: DataTypes.STRING(65)
  // }, {});
  
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

    Comment.addHook("afterFind", findResult => {
      if (!Array.isArray(findResult)) findResult = [findResult];
      for (const instance of findResult) {
        if (instance.commentableType === "post" && instance.post !== undefined) {
          instance.commentable = instance.post;
        } else if (instance.commentableType === "comment" && instance.comment !== undefined) {
          instance.commentable = instance.comment;
        }
        // To prevent mistakes:
        delete instance.image;
        delete instance.dataValues.image;
        delete instance.video;
        delete instance.dataValues.video;
      }
    });
  };
  return Comment;
};
