'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sub_Kriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Kriteria, {
        as: "kriteria",
        foreignKey: "kode_kriteria",
        targetKey: "kode_kriteria",
        // onDelete: "cascade"
      })
      this.hasMany(models.Rel_Alternatif, {
        as: "rel_alternatif",
        foreignKey: "id_subkriteria",
        sourceKey: "id"
      })
    }
  }
  Sub_Kriteria.init({
    nama_subkriteria: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "nama subkriteria is required"
        }
      }
    },
    kode_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "kode kriteria is required"
        }
      }
    },
    bobot_subkriteria: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "bobot sub kriteria is required"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Sub_Kriteria',
  });
  return Sub_Kriteria;
};