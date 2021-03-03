module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('posts', [
      {
        user_id: 1,
        title: "The first post",
        description: "The content of the first post",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        title: "The second post",
        description: "The content of the second post",
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('posts', null, {});
  }
};