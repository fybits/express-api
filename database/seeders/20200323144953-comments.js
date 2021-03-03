module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comments', [
      {
        user_id: 1,
        commentable_id: 2,
        commentable_type: 'post',
        message: 'The comment below a post',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        commentable_id: 2,
        commentable_type: 'post',
        message: 'The comment below a post which is also commentable',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        commentable_id: 2,
        commentable_type: 'comment',
        message: 'The comment below another comment',
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  }
};