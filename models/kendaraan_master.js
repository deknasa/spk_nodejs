'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kendaraan_Master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Alternatif, {
        as: "data-alternatif",
        foreignKey: "nama_alternatif",
        sourceKey: "nama_alternatif"
      })
    }
  }
  Kendaraan_Master.init({
    nama_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "nama alternatif is required"
        }
      }
    },
    harga: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "vikor_harga is required"
        },
        isInt: {
          args: true,
          msg: "vikor_harga must be integer"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Kendaraan_Master',
  });
  return Kendaraan_Master;
};