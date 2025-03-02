'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Alternatifs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_alternatif: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      nama_alternatif: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      vikor_total: {
        type: Sequelize.DOUBLE
      },
      vikor_rank: {
        type: Sequelize.INTEGER
      },
      vikor_hasil: {
        type: Sequelize.STRING
      },
      vikor_harga: {
        type: Sequelize.INTEGER
      },
      moora_total: {
        type: Sequelize.DOUBLE
      },
      moora_rank: {
        type: Sequelize.INTEGER
      },
      moora_hasil: {
        type: Sequelize.STRING
      },
      moora_harga: {
        type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Alternatifs');
  }
};