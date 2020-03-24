module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comments', [
      {
        userId: 1,
        commentableId: 2,
        commentableType: 'post',
        message: 'The comment below a post',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        commentableId: 2,
        commentableType: 'post',
        message: 'The comment below a post which is also commentable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        commentableId: 2,
        commentableType: 'comment',
        message: 'The comment below another comment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  }
};