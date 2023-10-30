'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kriteria', {
      id: {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER,
        // onDelete: "cascade",
        // references: {
        //   model: ''
        // }
      },
      kode_kriteria: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      nama_kriteria: {
        type: Sequelize.STRING
      },
      bobot_kriteria: {
        type: Sequelize.DOUBLE
      },
      jenis_kriteria: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    queryInterface.addColumn(
      'Orders', // name of Source model
      'CustomerId', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        references: {
          model: 'Customers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Kriteria');
  }
};