'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rel_Alternatif extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Alternatif, {
        as: "alternatif",
        foreignKey: "kode_alternatif",
        targetKey: "kode_alternatif"
      })
      this.belongsTo(models.Kriteria, {
        as: "kriteria",
        foreignKey: "kode_kriteria",
        targetKey: "kode_kriteria"
      })
      this.belongsTo(models.Sub_Kriteria, {
        as: "sub_kriteria",
        foreignKey: "id_subkriteria",
        targetKey: "id"
      })
    }
  }
  Rel_Alternatif.init({
    kode_alternatif: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "kode_alternatif is required"
        }
      }
    },
    kode_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "kode_kriteria is required"
        }
      }
    },
    id_subkriteria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "id_subkriteria is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Rel_Alternatif',
  });
  return Rel_Alternatif;
};