module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: "bruh@bruh.com",
        first_name: "bruh",
        last_name: "bruh",
        password: "wocncsuxuydgauysgcuzxgcsamlzckmoon",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: "email@mail.com",
        first_name: "name",
        last_name: "last_name",
        password: "213123123uydgauysgcuzxgcsamlzckmoon",
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};