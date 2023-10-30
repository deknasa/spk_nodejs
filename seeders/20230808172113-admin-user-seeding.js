'use strict';
const { hashedPassword } = require('../helpers/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert("Users", [{
      full_name: "admin",
      email: "admin@gmail.com",
      password: `${hashedPassword("admin123")}`,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
