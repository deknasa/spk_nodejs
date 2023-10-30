'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Sub_Kriteria, {
        as: "sub_kriteria",
        foreignKey: "kode_kriteria",
        sourceKey: "kode_kriteria",
        // onDelete: 'cascade',
        // hooks: true
      })
      this.hasMany(models.Rel_Alternatif, {
        as: "rel_alternatif",
        foreignKey: "kode_kriteria",
        sourceKey: "kode_kriteria"
      })
    }
  }
  Kriteria.init({
    kode_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Kode kriteria already exist"
      },
      // validate: {
      //   notEmpty: {
      //     args: true,
      //     msg: "kode kriteria is required"
      //   }
      // }
    },
    nama_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Kriteria already exist"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "nama kriteria is required"
        }
      }
    },
    bobot_kriteria: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "bobot kriteria is required"
        },
      }
    },
    jenis_kriteria: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["benefit", "cost"],
      validate: {
        isIn: {
          args: [
            ["benefit", "cost"]
          ],
          msg: "jenis kriteria must be benefit or cost",
        },
        notEmpty: {
          args: true,
          msg: "jenis kriteria is required"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Kriteria',
  });
  return Kriteria;
};