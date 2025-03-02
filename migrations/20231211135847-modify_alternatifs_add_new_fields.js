'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'Alternatifs',
      'hitung_harga',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        // defaultValue: 0
      }
    )
    // return queryInterface.changeColumn(
    //   'Alternatifs',
    //   'hitung_harga',
    //   {
    //     type: Sequelize.INTEGER,
    //   }
    // )
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('Alternatifs', 'hitung_harga')
    // return queryInterface.changeColumn('Alternatifs', 'hitung_harga');
  }
};
