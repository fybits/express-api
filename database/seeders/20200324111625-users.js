module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: "bruh@bruh.com",
        firstName: "bruh",
        lastName: "bruh",
        password: "wocncsuxuydgauysgcuzxgcsamlzckmoon",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: "email@mail.com",
        firstName: "name",
        lastName: "lastname",
        password: "213123123uydgauysgcuzxgcsamlzckmoon",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};