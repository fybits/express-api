module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('posts', [
      {
        userId: 1,
        title: "The first post",
        description: "The content of the first post",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: "The second post",
        description: "The content of the second post",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('posts', null, {});
  }
};